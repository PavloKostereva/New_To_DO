import React from "react";
import { Task, TodoList } from "./types";
import { User } from "firebase/auth";

interface MainContentProps {
  activeList: string | null;
  todoLists: TodoList[];
  user: User | null;
  ownedLists: TodoList[];
  sharedLists: TodoList[];
  setActiveList: (id: string | null) => void;
  newTask: { [key: string]: { title: string; description: string; assignedTo: string } };
  setNewTask: (task: { [key: string]: { title: string; description: string; assignedTo: string } }) => void;
  editingList: { id: string; name: string } | null;
  setEditingList: (list: { id: string; name: string } | null) => void;
  editingTask: { listId: string; task: Task } | null;
  setEditingTask: (task: { listId: string; task: Task } | null) => void;
  newCollaborator: { email: string; role: 'admin' | 'viewer' };
  setNewCollaborator: (collaborator: { email: string; role: 'admin' | 'viewer' }) => void;
  handleUpdateList: () => Promise<void>;
  toggleTask: (listId: string, taskId: string) => Promise<void>;
  handleAddTask: (listId: string) => Promise<void>;
  handleDeleteTask: (listId: string, taskId: string) => Promise<void>;
  handleUpdateTask: () => Promise<void>;
  addCollaborator: (listId: string) => Promise<void>;
  removeCollaborator: (listId: string, email: string) => Promise<void>;
  getUserRole: (list: TodoList) => 'owner' | 'admin' | 'viewer' | null;
  translations: typeof import("./translations").translations;
}

export const MainContent = ({
  activeList,
  todoLists,
  user,
  ownedLists,
  sharedLists,
  setActiveList,
  newTask,
  setNewTask,
  editingList,
  setEditingList,
  editingTask,
  setEditingTask,
  newCollaborator,
  setNewCollaborator,
  handleUpdateList,
  toggleTask,
  handleAddTask,
  handleDeleteTask,
  handleUpdateTask,
  addCollaborator,
  removeCollaborator,
  getUserRole,
  translations,
}: MainContentProps) => {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {activeList ? todoLists.find(list => list.id === activeList)?.title || translations.dashboard : translations.dashboard}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Увійшли як: {user?.email}</p>
      </div>
      {!activeList ? (
        <div className="space-y-8">
          {ownedLists.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{translations.owned}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedLists.map((list) => (
                  <div
                    key={list.id}
                    className="border p-4 rounded-lg hover:shadow-md cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700"
                    onClick={() => setActiveList(list.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white truncate">{list.title}</h3>
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        ({list.tasks.filter(t => t.completed).length}/{list.tasks.length})
                      </span>
                    </div>
                    {list.tasks.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {list.tasks.slice(0, 3).map(task => (
                          <li
                            key={task.id}
                            className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"} truncate`}
                          >
                            {task.title}
                            {task.assignedTo && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                (Призначено: {task.assignedTo})
                              </span>
                            )}
                          </li>
                        ))}
                        {list.tasks.length > 3 && (
                          <li className="text-sm text-gray-500 dark:text-gray-400">+{list.tasks.length - 3} більше</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{translations.noTasks}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {sharedLists.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{translations.shared}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedLists.map((list) => (
                  <div
                    key={list.id}
                    className="border p-4 rounded-lg hover:shadow-md cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700"
                    onClick={() => setActiveList(list.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white truncate">{list.title}</h3>
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        ({list.tasks.filter(t => t.completed).length}/{list.tasks.length})
                      </span>
                    </div>
                    {list.tasks.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {list.tasks.slice(0, 3).map(task => (
                          <li
                            key={task.id}
                            className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"} truncate`}
                          >
                            {task.title}
                            {task.assignedTo && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                (Призначено: {task.assignedTo})
                              </span>
                            )}
                          </li>
                        ))}
                        {list.tasks.length > 3 && (
                          <li className="text-sm text-gray-500 dark:text-gray-400">+{list.tasks.length - 3} більше</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{translations.noTasks}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveList(null)}
            className="mb-4 flex items-center text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {translations.back}
          </button>
          {todoLists.filter(list => list.id === activeList).map(list => {
            const userRole = getUserRole(list);
            const isOwner = userRole === 'owner';
            const isAdmin = userRole === 'admin';
            const isViewer = userRole === 'viewer';

            return (
              <div key={list.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:shadow-gray-700/50">
                <div className="flex justify-between items-center mb-6">
                  {editingList?.id === list.id ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={editingList.name}
                        onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                        className="border-b p-1 flex-1 mr-2 bg-transparent text-gray-800 dark:text-white"
                      />
                      <button
                        onClick={handleUpdateList}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        {translations.save}
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-400 ml-1"
                      >
                        {translations.cancel}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{list.title}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {isOwner ? translations.owner : isAdmin ? translations.admin : translations.viewer}
                        </span>
                      </div>
                      {(isOwner || isAdmin) && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingList({ id: list.id, name: list.title })}
                            className="text-blue-500 hover:underline dark:text-blue-400"
                          >
                            {translations.edit}
                          </button>
                          {isOwner && (
                            <button
                              onClick={() => handleDeleteList(list.id)}
                              className="text-red-500 hover:underline dark:text-red-400"
                            >
                              {translations.delete}
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {(isOwner || isAdmin) && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">{translations.addTask}</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newTask[list.id]?.title || ""}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          [list.id]: {
                            ...(newTask[list.id] || { title: "", description: "", assignedTo: "" }),
                            title: e.target.value
                          }
                        })}
                        placeholder={translations.taskTitle}
                        className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask(list.id)}
                      />
                      <textarea
                        value={newTask[list.id]?.description || ""}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          [list.id]: {
                            ...(newTask[list.id] || { title: "", description: "", assignedTo: "" }),
                            description: e.target.value
                          }
                        })}
                        placeholder={translations.taskDescription}
                        className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        rows={2}
                      />
                      <select
                        value={newTask[list.id]?.assignedTo || ""}
                        onChange={(e) => setNewTask({
                          ...newTask,
                          [list.id]: {
                            ...(newTask[list.id] || { title: "", description: "", assignedTo: "" }),
                            assignedTo: e.target.value
                          }
                        })}
                        className="border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        <option value="">Не призначено</option>
                        {list.participants.map((participant) => (
                          <option key={participant.email} value={participant.email}>
                            {participant.email} ({participant.role === 'admin' ? translations.admin : translations.viewer})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddTask(list.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {translations.addTask}
                      </button>
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">
                    {translations.tasks} ({list.tasks.length})
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {list.tasks.filter(t => t.completed).length} {translations.completed}
                    </span>
                  </h4>
                  {list.tasks.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">{translations.noTasks}</p>
                  ) : (
                    <ul className="space-y-3">
                      {list.tasks.map((task) => (
                        <li key={task.id} className="border-b pb-3 border-gray-200 dark:border-gray-700">
                          {editingTask?.task.id === task.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingTask.task.title}
                                onChange={(e) => setEditingTask({
                                  ...editingTask,
                                  task: { ...editingTask.task, title: e.target.value }
                                })}
                                className="border p-1 rounded w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                              />
                              <textarea
                                value={editingTask.task.description}
                                onChange={(e) => setEditingTask({
                                  ...editingTask,
                                  task: { ...editingTask.task, description: e.target.value }
                                })}
                                className="border p-1 rounded w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                rows={2}
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleUpdateTask}
                                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                  {translations.save}
                                </button>
                                <button
                                  onClick={() => setEditingTask(null)}
                                  className="bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-400"
                                >
                                  {translations.cancel}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(list.id, task.id)}
                                  className="mt-1 mr-2 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                  disabled={!canToggleTask(list)}
                                />
                                <div className="min-w-0">
                                  <p className={`font-medium truncate ${task.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className={`text-sm truncate ${task.completed ? "text-gray-400" : "text-gray-600 dark:text-gray-400"}`}>
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <p>{new Date(task.createdAt).toLocaleString()}</p>
                                    {task.assignedTo && <p>Призначено: {task.assignedTo}</p>}
                                  </div>
                                </div>
                              </div>
                              {(isOwner || isAdmin || (isViewer && task.createdBy === user?.email)) && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setEditingTask({ listId: list.id, task })}
                                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm"
                                  >
                                    {translations.edit}
                                  </button>
                                  {(isOwner || isAdmin) && (
                                    <button
                                      onClick={() => handleDeleteTask(list.id, task.id)}
                                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
                                    >
                                      {translations.delete}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {(isOwner || isAdmin) && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">{translations.collaborators}</h4>
                    <div className="flex items-center mb-2">
                      <input
                        type="email"
                        value={newCollaborator.email}
                        onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                        placeholder={translations.addCollaborator}
                        className="border p-2 rounded-l w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addCollaborator(list.id)}
                      />
                      <select
                        value={newCollaborator.role}
                        onChange={(e) => setNewCollaborator({
                          ...newCollaborator,
                          role: e.target.value as 'admin' | 'viewer'
                        })}
                        className="border-t border-b border-r p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        <option value="admin">{translations.admin}</option>
                        <option value="viewer">{translations.viewer}</option>
                      </select>
                      <button
                        onClick={() => addCollaborator(list.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                      >
                        {translations.addCollaborator}
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {list.participants.map((participant, i) => (
                        <li key={i} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                          <span className="truncate">
                            {participant.email} <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({participant.role === 'admin' ? translations.admin : translations.viewer})
                            </span>
                          </span>
                          {participant.email !== user?.email && (isOwner || (isAdmin && participant.role !== 'admin')) && (
                            <button
                              onClick={() => removeCollaborator(list.id, participant.email)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
                            >
                              {translations.remove}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};