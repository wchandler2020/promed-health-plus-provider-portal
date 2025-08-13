import React, { useState, useEffect, useCallback } from 'react';
import { createEditor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import authRequest from "../../../utils/axios";
import { API_BASE_URL } from '../../../utils/constants';
import { set } from 'date-fns';
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const ini = [
    {
        type: "paragraph",
        children: [{ text: "" }]
    },
];

// Convert Slate value to HTML
const serialize = (value) => {
    return JSON.stringify(value);
}

//Convert HTML to Slate value
const deserialize = (html) => {
    try {
        const parse = JSON.parse(html);
        if (Array.isArray(parse)) return parse;
        return ini;
    } catch {
        return ini;
    }
}

const Notes = ({ patientId }) => {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editorTitle, setEditorTitle] = useState("");
    const [editorValue, setEditorValue] = useState(ini);
    const editor = React.useMemo(() => withReact(createEditor()), []);
    

    //Fetch notes for patient 
    useEffect(() => {
        if (!patientId) return;
        const fetchNotes = async () => {
            try { 
                const axioInstance = authRequest();
                axioInstance.get(`${API_BASE_URL}/notes/?patient=${patientId}`)
                .then((res) => setNotes(res.data))
                .catch(() => setNotes([]));
            } catch (error) {
                console.error("ErSror fetching notes:", error);
            }
        };
        fetchNotes();
    }, [patientId]);

    // Adding a note through editing
    const start = (note = null) => {
        setEditingNote(note);
        setEditorTitle(note ? note.title : "");
        setEditorValue(note && note.body ? deserialize(note.body) : ini);
        setShowEditor(true);
    };


    //Add or update note
    const handleSave = async () => {
        const text = serialize(editorValue);
        if (editingNote) {
            // Update 
            try {
                const axiosInstance = authRequest();
                await axiosInstance.put(`${API_BASE_URL}/notes/${editingNote.id}/`, {
                    ...editingNote,
                    title: editorTitle || "Note",
                    body: text,
                });
            } catch (error) {
                console.error("Error updating note:", error);
            }
        } else {
            // Create
            try {
                const axiosInstance = authRequest();
                await axiosInstance.post(`${API_BASE_URL}/notes/`, {
                    patient: patientId,
                    title: editorTitle || "Note",
                    body: text,
                });
            } catch (error) {
                console.error("Error creating note:", error);
            }
        }
        setShowEditor(false);
        setEditingNote(null);
        setEditorTitle("");
        setEditorValue(ini);
        
        // Refresh Note
        
        try {
            const axiosInstance = authRequest();
            const res = await axiosInstance.get(`${API_BASE_URL}/notes/?patient=${patientId}`);
            setNotes(res.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };


    //Delete note
    const handleDelete = async (id) => {
        try {
            const axiosInstance = authRequest();
            await axiosInstance.delete(`${API_BASE_URL}/notes/${id}/`);
            setNotes(notes.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
    <div>
        <p className="text-sm font-semibold text-center">Patient Documentation</p>
        <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 5 }}>
        <div className="flex items-center justify-between mb-2">
            <p className="text-xs flex">
            <strong>Notes</strong>
            </p>
            <button
            className="flex items-center gap-1 text-emerald-600 text-xs"
            onClick={() => start(null)}
            >
            + Add Note
            </button>
        </div>
        {notes.map((note) => (
            <div key={note.id} className="flex flex-col border rounded p-2 mb-2 bg-gray-50">
            <div className="flex justify-between items-center mb-1">
                <div>
                <strong>{note.title}</strong>
                </div>
                <div className="flex space-x-2">
                <FaEdit
                    className="text-gray-500 hover:text-green-500 cursor-pointer"
                    onClick={() => start(note)}
                />
                <FaTrashAlt
                    className="text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => handleDelete(note.id)}
                />
                </div>
            </div>
            {Array.isArray(deserialize(note.body)) ? deserialize(note.body).map((node, idx) =>
                <div key={idx}>
                {node.children.map((child, childidx) => child.text).join(' ')}
                </div>
            ) : note.body}
            </div>
        ))}
        {showEditor && Array.isArray(editorValue) && (
            <div className="border rounded p-2 mt-2 bg-gray-100">
            <input
                className="border p-1 w-full mb-2"
                placeholder="Title"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
            />
            <Slate
                editor={editor}
                initialValue={editorValue.length > 0 ? editorValue : ini}
                onChange={val => setEditorValue(Array.isArray(val) ? val : ini)}
            >
                <Editable
                style={{ minHeight: '100px', border: '1px solid #ccc', padding: '10px' }}
                />
            </Slate>
            <div className="flex gap-2 mt-2">
                <button
                className="bg-emerald-500 text-white px-3 py-1 rounded"
                onClick={handleSave}
                >
                Save
                </button>
                <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setShowEditor(false)}
                >
                Cancel
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
    );
};
export default Notes;