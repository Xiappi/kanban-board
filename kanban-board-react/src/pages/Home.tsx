import CardBoard from "../components/CardBoard";
import type { BoardModel } from "../models/BoardModel";
import ModalBase from "../components/ModalBase";
import Icon from "@mdi/react";
import { mdiPlus, mdiMagnify, mdiMenu } from "@mdi/js";
import { useState, useEffect } from "react";
import { db } from "../auth/firebase";
import {
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { boardCollectionRef } from "../db/Collections";
import Button from "../components/Button";
import type { DropdownEntry } from "../components/DropdownMenu";
import DropdownMenu from "../components/DropdownMenu";
import { RowActionsMenu, type RowAction } from "../components/RowActionsMenu";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [allBoards, setAllBoards] = useState<BoardModel[]>([]);
  const [visibleBoards, setVisibleBoards] = useState<BoardModel[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [name, setName] = useState(String);
  const [description, setDescription] = useState(String);

  const { user } = useAuth();

  async function loadBoards() {
    if (!user?.email) {
      return;
    }
    try {
      setLoading(true);

      const q = query(boardCollectionRef, where("user", "==", user?.email));
      const snapshot = await getDocs(q);
      const boards: BoardModel[] = snapshot.docs.map((d) => d.data());
      setAllBoards(boards);
    } catch (err) {
      setAllBoards([]);
      // TODO: Toaster
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadBoards();
  }, []);

  const createBoard = async () => {
    if (!user?.email) {
      return;
    }
    try {
      setLoading(true);
      const newBoard: BoardModel = {
        id: "", // ignored on write
        name,
        description,
        created: new Date(),
        lastModified: new Date(),
        lastModifiedBy: user.email!,
        user: user.email!,
      };
      await setDoc(doc(boardCollectionRef), newBoard);
      await loadBoards();
    } catch (err) {
      //TODO: Toaster
    } finally {
      setLoading(false);
      closeCreateModal();
    }
  };

  async function deleteBoard() {
    closeDeleteModal();

    // 1) Update UI immediately
    setAllBoards((prev) => prev.filter((b) => b.id !== deleteTargetId));

    // 2) x persist delete to Firestore
    try {
      await deleteDoc(doc(db, "boards", deleteTargetId));
    } catch (e) {
      // rollback if needed or show a toast
      console.error(e);
    }
  }

  async function handleDelete(id: string) {
    setOpenDeleteModal(true);
    setDeleteTargetId(id);
  }

  async function handleOpen(id: string) {
    navigate(`/board/${id}`);
  }

  async function handleEdit(id: string) {
    alert("edit: " + id);
  }

  function closeCreateModal() {
    setOpenCreateModal(false);
    setName("");
    setDescription("");
  }

  function closeDeleteModal() {
    setOpenDeleteModal(false);
    setDeleteTargetId("");
  }

  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col relative overflow-x-auto shadow-b-lg sm:rounded-lg ">
        <div className="p-4 bg-white justify-items-end">
          <div className="flex items-center">
            <Button onClick={() => setOpenCreateModal(true)}>
              <p>Add New Board</p>
              <Icon path={mdiPlus} size={0.75}></Icon>
            </Button>

            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <Icon path={mdiMagnify} size={1}></Icon>
              </div>
              <input
                type="text"
                id="table-search"
                className="py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                placeholder="Search for items"
              />
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Last Modified
              </th>
              <th scope="col" className="px-6 py-3">
                Last Modified By
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allBoards.map((board) => {
              const dropdownEntries: RowAction[] = [
                {
                  id: "open",
                  label: "Open",
                  onClick: () => handleOpen(board.id),
                },
                {
                  id: "edit",
                  label: "Edit",
                  onClick: () => handleEdit(board.id),
                },
                {
                  id: "delete",
                  label: "Delete",
                  onClick: () => handleDelete(board.id),
                },
              ];
              return (
                <tr
                  onClick={() => handleOpen(board.id)}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {board.name}
                  </th>
                  <td className="px-6 py-4">{board.description}</td>
                  <td className="px-6 py-4">
                    {board.lastModified.toDateString()}
                  </td>
                  <td className="px-6 py-4">{board.lastModifiedBy}</td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RowActionsMenu actions={dropdownEntries}></RowActionsMenu>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={5} className="px-6 py-6 text-center">
                <Button onClick={() => setOpenCreateModal(true)}>
                  <p>Add New Board</p>
                  <Icon path={mdiPlus} size={0.75}></Icon>
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      <ModalBase
        shouldOpen={openCreateModal}
        onClose={() => closeCreateModal()}
      >
        <div>
          <h2 className="text-2xl font-semibold pb-4">Create New Board</h2>
        </div>
        <form className="max-w-md mx-auto" onSubmit={createBoard}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              name="floating_name"
              id="floating_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Name
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              name="floating_description"
              id="floating_description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              maxLength={25}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Description
            </label>
          </div>

          <div className="w-full flex justify-between">
            <button
              onClick={closeCreateModal}
              className="border border-[#d1d5db] rounded-lg bg-gray-50 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              Create
            </button>
          </div>
        </form>
      </ModalBase>

      {/* Delete modal */}
      <ModalBase shouldOpen={openDeleteModal} onClose={closeDeleteModal}>
        <div>
          <h2 className="text-2xl font-semibold pb-3">Are you sure</h2>
          <p className="text-md text-gray-500 pb-5">
            This action cannot be undone
          </p>
        </div>
        <div className="w-full flex justify-between mt-5">
          <button
            onClick={closeDeleteModal}
            className="border border-[#d1d5db] rounded-lg bg-gray-50 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={deleteBoard}
            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg l px-5 py-2.5 text-center"
          >
            Delete
          </button>
        </div>
      </ModalBase>
    </>
  );
}
