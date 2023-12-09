'use client'
import { useFormContext } from '@/app/contexts/FormContext'
import { useNotification } from '@/app/contexts/NotificationContext';
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from 'react'
import { Spinner } from "@material-tailwind/react";
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

import { studyGroupController } from '@/app/controllers';
import Link from 'next/link';

export default function Page() {
    const { name, setName } = useFormContext()
    const { user, setUser } = useAuthContext()
    const [studygroups, setStudygroups] = useState([]);
    const { setNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [studygroup, setStudyGroup] = useState({})

    const [isModalOpen, setModalOpen] = useState(false);
    const [newStudyGroupName, setNewStudyGroupName] = useState('');

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        setIsLoading(true)

        const fetchstudygroups = async () => {
            const response = await studyGroupController.getAllStudyGroups(user);
            setStudygroups([...studygroups, ...response])
        }

        fetchstudygroups()
            .catch(console.error);
        setIsLoading(false)
    }, [])

    const handleStudyGroupNameChange = (event) => {
        setName(event.target.value)
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleCreateStudyGroup = async (event) => {
        event.preventDefault()
        const response = await studyGroupController.createStudyGroup(name)
        if (response.ok) {
            setStudygroups([...studygroups, response])
            setNotification(`Successfully created the group. `, 'success')
            setModalOpen(false)
            console.log('res1', respons)
        } else {
            setNotification( 'error')
        }
    }
    const handleJoinStudyGroup = async (event, studygroup) => {
        event.preventDefault()
        setModalOpen(false)
        const response = await studyGroupController.joinStudyGroup(studygroup, user);
        if (response.ok) {
            setStudygroups([...studygroups, response])
            setNotification(`Welcome to the group.`, 'success')
        } else {
            setNotification(`Error `, 'error')
        }
    }

    const handleSearchStudyGroup = async (event) => {
        setSearchResults([])
        event.preventDefault()
        const response = await studyGroupController.searchStudyGroup(searchTerm);
        if (response.ok) {
            setSearchResults(response.body)
        } else throw new Error(response.message)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">

            <div className='flex flex-col justify-center items-center'>
                <div className='flex flex-row justify-center align-center items-center'>
                    <input onChange={handleSearchTermChange} className='rounded-full p-2 px-4 mt-12' type="search" placeholder='Search for study groups' />
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-full mt-4'
                        onClick={handleSearchStudyGroup}
                    >
                        search
                    </button>
                </div>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-full mt-4'
                    onClick={openModal}
                >
                    Add
                </button>

                {isModalOpen && (
                    <div className='modal z-10'>
                        <div className='bg-white modal-content border border-gray-300 rounded-lg p-4'>
                            <div className='flex justify-end'>
                                <span className='close bg-gray-400 h-5 w-5 rounded-full flex justify-center items-center' onClick={closeModal}>
                                    &times;
                                </span>
                            </div>
                            <h2>Create Study Group</h2>
                            <input
                                type="text"
                                placeholder="Enter study group name"
                                //value={newStudyGroupName}
                                onChange={handleStudyGroupNameChange}
                                className='border border-gray-300 rounded-lg p-2 w-full mt-4'
                            />
                            <div className=' flex gap-4'>
                                <button className='bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-full mt-4' onClick={handleCreateStudyGroup}>Create</button>
                                <button className='bg-red-500 hover:bg-blue-700 text-white px-4 rounded-full mt-4' onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {searchTerm ? (
                <div className='flex flex-col gap-2'>
                    {searchResults.map((studyGroup) => (
                        <div className='flex justify-between space-x-3 items-center bg-gray-100 rounded-lg shadow-lg p-4 m-4' key={studyGroup.id}>
                            <h2 className='text-2xl font-bold'>{studyGroup.name}</h2>
                            <button onClick={(event) => handleJoinStudyGroup(event, studyGroup)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4'>
                                Join
                            </button>
                        </div>
                    ))}
                </div>) : (<div className='flex flex-col gap-2'>
                    {studygroups.map((studyGroup) => (
                        <Link href={`/studygroups/${studyGroup._id}`}>
                            <div
                                className='flex justify-between space-x-3 items-center bg-gray-100 rounded-lg shadow-lg p-4 m-4'
                                key={studyGroup.id}
                            >
                                <h2 className='text-2xl font-bold'>{studyGroup.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>)}
            </div>
        </main>
    )
}