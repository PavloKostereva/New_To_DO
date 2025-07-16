"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { translations } from "./translations";
import { Participant, Task, TodoList } from "./types";
import { collection, CollectionReference, DocumentData, Firestore, onSnapshot, query } from "firebase/firestore";

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [newTask, setNewTask] = useState<{ [key: string]: { title: string; description: string; assignedTo: string } }>({});
  const [editingList, setEditingList] = useState<{ id: string; name: string } | null>(null);
  const [editingTask, setEditingTask] = useState<{ listId: string; task: Task } | null>(null);
  const [newCollaborator, setNewCollaborator] = useState({ email: "", role: "viewer" as 'admin' | 'viewer' });
  const [activeList, setActiveList] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth");
      } else {
        setUser(currentUser);
        await fetchLists(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [router]);

  const fetchLists = async (currentUser: User) => {
    const listsQuery = query(collection(db, "taskLists"));
    const unsubscribe = onSnapshot(listsQuery, (querySnapshot) => {
      const lists: TodoList[] = [];
      querySnapshot.forEach((doc) => {
        const listData = doc.data();
        const isOwner = listData.ownerId === currentUser.uid;
        const isParticipant = listData.participants?.some(
          (p: Participant) => p.email === currentUser.email || p.userId === currentUser.uid
        );
        if (isOwner || isParticipant) {
          lists.push({
            id: doc.id,
            title: listData.title,
            ownerId: listData.ownerId,
            participants: listData.participants || [],
            tasks: listData.tasks || [],
            createdAt: listData.createdAt
          });
        }
      });
      setTodoLists(lists);
    });
    return () => unsubscribe();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/register");
  };

  const handleCreateList = async () => {
    if (!newListName.trim() || !user) return;
    try {
      const newList = {
        title: newListName,
        ownerId: user.uid,
        participants: [{ email: user.email || "", role: 'admin', userId: user.uid }],
        tasks: [],
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "taskLists"), newList);
      setNewListName("");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteDoc(doc(db, "taskLists", listId));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleUpdateList = async () => {
    if (!editingList || !user) return;
    try {
      await updateDoc(doc(db, "taskLists", editingList.id), { title: editingList.name });
      setEditingList(null);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const toggleTask = async (listId: string, taskId: string) => {
    try {
      const list = todoLists.find(l => l.id === listId);
      if (!list) return;
      const updatedTasks = list.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
      await updateDoc(doc(db, "taskLists", listId), { tasks: updatedTasks });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleAddTask = async (listId: string) => {
    if (!newTask[listId]?.title.trim() || !user) return;
    try {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask[listId].title,
        description: newTask[listId].description,
        completed: false,
        createdAt: new Date().toISOString(),
        createdBy: user.email || "",
        assignedTo: newTask[listId].assignedTo
      };
      const list = todoLists.find(l => l.id === listId);
      if (!list) return;
      const updatedTasks = [...list.tasks, task];
      await updateDoc(doc(db, "taskLists", listId), { tasks: updatedTasks });
      setNewTask({ ...newTask, [listId]: { title: "", description: "", assignedTo: "" } });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (listId: string, taskId: string) => {
    try {
      const list = todoLists.find(l => l.id === listId);
      if (!list) return;
      const updatedTasks = list.tasks.filter(task => task.id !== taskId);
      await updateDoc(doc(db, "taskLists", listId), { tasks: updatedTasks });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const list = todoLists.find(l => l.id === editingTask.listId);
      if (!list) return;
      const updatedTasks = list.tasks.map(task => task.id === editingTask.task.id ? editingTask.task : task);
      await updateDoc(doc(db, "taskLists", editingTask.listId), { tasks: updatedTasks });
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const addCollaborator = async (listId: string) => {
    if (!newCollaborator.email.trim()) return;
    try {
      const list = todoLists.find(l => l.id === listId);
      if (!list) return;
      const normalizedEmail = newCollaborator.email.toLowerCase();
      if (list.participants.some(p => p.email.toLowerCase() === normalizedEmail)) {
        alert("Цей користувач вже є співучасником");
        return;
      }
      await updateDoc(doc(db, "taskLists", listId), {
        participants: arrayUnion({ email: newCollaborator.email, role: newCollaborator.role })
      });
      setNewCollaborator({ email: "", role: "viewer" });
    } catch (error) {
      console.error("Error adding collaborator:", error);
      alert("Помилка при додаванні співучасника. Перевірте правильність email.");
    }
  };

  const removeCollaborator = async (listId: string, email: string) => {
    try {
      const list = todoLists.find(l => l.id === listId);
      if (!list) return;
      const participant = list.participants.find(p => p.email === email);
      if (!participant) return;
      await updateDoc(doc(db, "taskLists", listId), { participants: arrayRemove(participant) });
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }
  };

  const getUserRole = (list: TodoList): 'owner' | 'admin' | 'viewer' | null => {
    if (!user) return null;
    if (list.ownerId === user.uid) return 'owner';
    const participant = list.participants.find(p => p.email === user.email || p.userId === user.uid);
    return participant ? participant.role : null;
  };

  const canEditList = (list: TodoList): boolean => getUserRole(list) === 'owner' || getUserRole(list) === 'admin';
  const canEditTask = (list: TodoList, task?: Task): boolean => {
    const role = getUserRole(list);
    return role === 'owner' || role === 'admin' || (role === 'viewer' && task?.createdBy === user?.email);
  };
  const canToggleTask = (list: TodoList): boolean => getUserRole(list) !== null;
  const canDeleteList = (list: TodoList): boolean => getUserRole(list) === 'owner';

  const filteredLists = todoLists.filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.tasks.some(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const ownedLists = filteredLists.filter(list => getUserRole(list) === 'owner');
  const sharedLists = filteredLists.filter(list => getUserRole(list) !== 'owner' && getUserRole(list) !== null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-400">{translations.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        todoLists={todoLists}
        ownedLists={ownedLists}
        sharedLists={sharedLists}
        activeList={activeList}
        setActiveList={setActiveList}
        newListName={newListName}
        setNewListName={setNewListName}
        handleCreateList={handleCreateList}
        handleLogout={handleLogout}
        translations={translations}
      />
      <MainContent
        activeList={activeList}
        todoLists={todoLists}
        user={user}
        ownedLists={ownedLists}
        sharedLists={sharedLists}
        setActiveList={setActiveList}
        newTask={newTask}
        setNewTask={setNewTask}
        editingList={editingList}
        setEditingList={setEditingList}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        newCollaborator={newCollaborator}
        setNewCollaborator={setNewCollaborator}
        handleUpdateList={handleUpdateList}
        toggleTask={toggleTask}
        handleAddTask={handleAddTask}
        handleDeleteTask={handleDeleteTask}
        handleUpdateTask={handleUpdateTask}
        addCollaborator={addCollaborator}
        removeCollaborator={removeCollaborator}
        getUserRole={getUserRole}
        translations={translations}
      />
    </div>
  );
};

export default DashboardPage;

function addDoc(arg0: CollectionReference<DocumentData, DocumentData>, newList: { title: string; ownerId: string; participants: { email: string; role: string; userId: string; }[]; tasks: never[]; createdAt: string; }) {
  throw new Error("Function not implemented.");
}


function deleteDoc(arg0: any) {
  throw new Error("Function not implemented.");
}


function doc(db: Firestore, arg1: string, listId: string): any {
  throw new Error("Function not implemented.");
}


function updateDoc(arg0: any, arg1: { title: string; }) {
  throw new Error("Function not implemented.");
}


function arrayUnion(arg0: { email: string; role: "viewer" | "admin"; }) {
  throw new Error("Function not implemented.");
}


function arrayRemove(participant: Participant) {
  throw new Error("Function not implemented.");
}
