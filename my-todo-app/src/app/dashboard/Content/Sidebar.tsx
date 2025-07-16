import React from "react";
import { TodoList } from "./types";

interface SidebarProps {
  todoLists: TodoList[];
  ownedLists: TodoList[];
  sharedLists: TodoList[];
  activeList: string | null;
  setActiveList: (id: string | null) => void;
  newListName: string;
  setNewListName: (name: string) => void;
  handleCreateList: () => void;
  handleLogout: () => void;
  translations: typeof import("./translations").translations;
}

export const Sidebar = ({
  todoLists,
  ownedLists,
  sharedLists,
  activeList,
  setActiveList,
  newListName,
  setNewListName,
  handleCreateList,
  handleLogout,
  translations,
}: SidebarProps) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">To-Do Lists</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder={translations.search}
          className="border p-2 rounded w-full mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {ownedLists.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{translations.owned}</h3>
              <div className="space-y-1">
                {ownedLists.map(list => (
                  <button
                    key={list.id}
                    className={`w-full text-left p-2 rounded flex justify-between items-center ${
                      activeList === list.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    onClick={() => setActiveList(list.id)}
                  >
                    <span className="truncate">{list.title}</span>
                    <span className="text-xs ml-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      ({list.tasks.filter(t => t.completed).length}/{list.tasks.length})
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {sharedLists.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{translations.shared}</h3>
              <div className="space-y-1">
                {sharedLists.map(list => (
                  <button
                    key={list.id}
                    className={`w-full text-left p-2 rounded flex justify-between items-center ${
                      activeList === list.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    onClick={() => setActiveList(list.id)}
                  >
                    <span className="truncate">{list.title}</span>
                    <span className="text-xs ml-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      ({list.tasks.filter(t => t.completed).length}/{list.tasks.length})
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder={translations.newListName}
            className="border p-2 rounded-l w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
          />
          <button
            onClick={handleCreateList}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            +
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left p-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          {translations.logout}
        </button>
      </div>
    </div>
  );
};