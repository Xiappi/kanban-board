import type { BoardModel } from "../models/BoardModel";
import ModalBase from "../components/ModalBase";
import Icon from "@mdi/react";
import { mdiPlus, mdiMagnify } from "@mdi/js";
import { useState, useEffect, useMemo } from "react";
import { db } from "../auth/firebase";
import {
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { boardCollectionRef } from "../db/Collections";
import Button from "../components/Button";
import { RowActionsMenu, type RowAction } from "../components/RowActionsMenu";
import FloatingInput from "../components/FloatingInput";
import Toaster from "../components/Toaster";
import { SpinnerOverlay } from "../components/SpinnerOverlay";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [allBoards, setAllBoards] = useState<BoardModel[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [editTargetId, setEditTargetId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);

    const q = query(boardCollectionRef, where("user", "==", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boards: BoardModel[] = snapshot.docs.map((d) => d.data());
      setAllBoards(boards);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.email]);

  const visibleBoards = useMemo(() => {
    if (!search) return allBoards;

    const term = search.toLowerCase();
    return allBoards.filter((b) =>
      [b.name, b.description, b.lastModifiedBy]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [allBoards, search]);

  async function createBoard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeCreateModal();

    if (!user?.email) {
      return;
    }

    try {
      type tempBoard = Omit<BoardModel, "id">;
      const newBoard: tempBoard = {
        name,
        description,
        created: new Date(),
        lastModified: new Date(),
        lastModifiedBy: user.email!,
        user: user.email!,
      };
      // The subscription to the firestore db will handle updating the screen
      await addDoc(boardCollectionRef, newBoard);
    } catch (e) {
      Toaster.error("Failed to create board");
    }
  }

  async function updateBoard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeEditModal();

    try {
      const boardRef = doc(boardCollectionRef, editTargetId);

      updateDoc(boardRef, {
        name: name,
        description: description,
        lastModified: new Date(),
        lastModifiedBy: user?.email ?? "",
      });
    } catch (e) {
      Toaster.error("Failed to create board");
    }
  }

  async function deleteBoard() {
    closeDeleteModal();
    try {
      await deleteDoc(doc(db, "boards", deleteTargetId));
    } catch (e) {
      Toaster.error("Failed to create board");
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
    setOpenEditModal(true);
    setEditTargetId(id);
    const board = allBoards.find((board) => board.id === id);
    setName(board!.name);
    setDescription(board!.description);
  }

  function closeCreateModal() {
    setOpenCreateModal(false);
    setName("");
    setDescription("");
  }

  function closeEditModal() {
    setOpenEditModal(false);
    setName("");
    setDescription("");
    setEditTargetId("");
  }

  function closeDeleteModal() {
    setOpenDeleteModal(false);
    setDeleteTargetId("");
  }

  if (loading) {
    return (
      <SpinnerOverlay
        loading={loading}
        showAfter={200}
        minVisible={400}
        fadeMs={200}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col relative overflow-x-auto shadow-b-lg sm:rounded-lg ">
        <div className="p-4 bg-white justify-items-end mt-8 pb-8">
          <div className="flex w-full justify-between">
            <h3 className="text-3xl border-b-2 border-blue-300 pb-1">
              My Boards
            </h3>
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
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
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
            {visibleBoards.map((board) => {
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
                  key={board.id}
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
          <FloatingInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></FloatingInput>
          <FloatingInput
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></FloatingInput>

          <div className="w-full flex justify-between">
            <Button variant="secondary" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </div>
        </form>
      </ModalBase>

      {/* Edit modal */}
      <ModalBase shouldOpen={openEditModal} onClose={closeEditModal}>
        <div>
          <h2 className="text-2xl font-semibold pb-4">Create New Board</h2>
        </div>
        <form className="max-w-md mx-auto" onSubmit={(e) => updateBoard(e)}>
          <FloatingInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></FloatingInput>
          <FloatingInput
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></FloatingInput>

          <div className="w-full flex justify-between">
            <Button variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
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
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteBoard}>
            Delete
          </Button>
        </div>
      </ModalBase>
    </>
  );
}
