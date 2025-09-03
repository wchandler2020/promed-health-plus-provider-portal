import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import authRequest from '../../../utils/axios';
import { API_BASE_URL } from '../../../utils/constants';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pdfClicked, setPdfClicked] = useState({});


    // Fetch tasks assigned to the provider
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const axioInstance = authRequest();
                const res = await axioInstance.get(`${API_BASE_URL}/tasks/?status=pending`);
                setTasks(res.data);
            } catch (error) {
                setTasks([]);
            }
            setLoading(false);
        };
        fetchTasks();
    }, []);

    // Handle PDF click
    const handlePdfClick = (taskId) => {
        setPdfClicked(prev => ({ ...prev, [taskId]: true }));
    };

    // Handle for "I agree" action
    const handleAgree = async (taskId) => {
        if (!pdfClicked[taskId]) {
            alert("Please view the document before agreeing.");
            return;
        }
        try {
            const axioInstance = authRequest();
            await axioInstance.post(`${API_BASE_URL}/tasks/${taskId}/complete/`);
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (error) {
            alert("Failed to complete task");
        }
    };

    if (loading) return <div>Loading tasks...</div>;
    return (
        <div className='mt-10 p-6 bg-white shadow-lg rounded'>
            <h2 className='text-xl font-semibold mb-4'>Tasks</h2>
            {tasks.length === 0 ? (
                <p className='text-gray-500'>No pending tasks.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className='border-b rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between'>
                            <span className='font-medium mb-2 md:mb-0'>{task.title}</span>
                            <div className='flex flex-row items-center mt-2 md:mt-0'>
                                <a
                                    href={task.document}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 underline text-xs mr-4'
                                    onClick={() => handlePdfClick(task.id)}
                                >
                                    View PDF
                                </a>
                                <Button
                                    variant='contained'
                                    color='success'
                                    onClick={() => handleAgree(task.id)}
                                    disabled={!pdfClicked[task.id]}
                                >
                                    I Agree
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Tasks;