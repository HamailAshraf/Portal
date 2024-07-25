import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Axios from 'axios';
import { UserContext } from "../context/UserContext";
import { deleteUser } from "../components/Delete";
import { getSearch } from "../components/GetSearch";
import { Dialog } from "primereact/dialog";
import ReactPaginate from 'react-paginate';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/tailwind-light/theme.css";
import "primereact/resources/primereact.min.css";
import './Home.css';
import { Patch } from "../components/Patch";


export const Home = () => {
    const [data, setData] = useState([]);
    
    const [firstSort, setFirstSort] = useState(false);
    const [lastSort, setLastSort] = useState(false);
    const [dataSort, setDataSort] = useState(true);

    const [selectedUser, setSelectedUser] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);

    const [displayDelete, setDisplayDelete] = useState(false);

    const [totalPages, setTotalPages] = useState(0);
    const { token } = useContext(UserContext);
    const { register, handleSubmit } = useForm();
    const { role } = useContext(UserContext);
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 5;

    const fetchData = async (pageNumber = 0, sortBy = '') => {
        try {
            if (!token) {
                console.error("No token found");
                return;
            }
            const response = await Axios.get(`http://localhost:3000/users/paginated${sortBy ? `/${sortBy}` : ''}?page=${pageNumber + 1}&limit=${usersPerPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.items);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log("Error fetching data: ", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id, token);
            fetchData(pageNumber, getSortParam());
        } catch (error) {
            console.log("Error deleting user: ", error.message);
        }
    };

    const handleSearch = async (formData) => {
        try {
            if (!formData.name || formData.name.length < 3) {
                fetchData(pageNumber, getSortParam());
                return;
            }
            const userData = await getSearch(formData.name, token);
            setData(userData ? userData.map(item => ({ ...item })) : []); 
            setPageNumber(0);
        } catch (error) {
            console.log("Error fetching user: ", error.message);
        }
    };

    const toggleFirstName = () => {
        setDataSort(false);
        setLastSort(false);
        setFirstSort(!firstSort);
    };

    const toggleLastName = () => {
        setDataSort(false);
        setFirstSort(false);
        setLastSort(!lastSort);
    };

    const getSortParam = () => {
        if (firstSort) return 'first_name';
        if (lastSort) return 'last_name';
        return '';
    };

    useEffect(() => {
        if (token) {
            fetchData(pageNumber, getSortParam());
        }
    }, [token, pageNumber, firstSort, lastSort, dataSort]);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <button 
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => {
                        setSelectedUser(rowData);
                        setDisplayDialog(true);
                    }}
                > Update
                </button>
                <button 
                    className="text-red-600 hover:underline"
                    onClick={() => {
                        setSelectedUser(rowData);
                        setDisplayDelete(true);
                        }}
                >
                  Delete  
                </button>
            </div>
        );
    };

    const dialogFooter = (
        <div>
            <button label='Close' icon='pi pi-times' onClick={() => setDisplayDialog(false)} className="p-button-text"></button>
        </div>
    );

    const deleteFooter = (
        <div>
            <button label='Close' icon='pi pi-times' onClick={() => setDisplayDelete(false)} className="p-button-text"></button>
        </div>
    );

    return (
        <>
            <div className='max-w-md mt-4 mb-4 mx-auto'>
                <form className="flex items-center space-x-2" onChange={handleSubmit(handleSearch)}>
                    <input className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 mb-2 dark:focus:border-blue-500" type="text" {...register("name")} />
                </form>
            </div>
            <div className="datatableContainer">
                <DataTable className="custom-datatable"
                 value={data} sortMode="multiple" tableStyle={{ minWidth: '50rem' }}>
                    <Column className="col" field="id" header="ID"/>
                    <Column className="col" field="first_name" header={<button onClick={toggleFirstName}>FIRST NAME</button>}/>
                    <Column className="col" field="last_name" header={<button onClick={toggleLastName}>LAST NAME</button>} />
                    <Column className="col" field="email" header="EMAIL"/>
                    <Column className="col" field="gender" header="GENDER"/>
                    <Column className="col" field="job_title" header="JOB TITLE"/>
                    {role === 1 && (
                        <Column
                        header="Actions"
                        body={actionBodyTemplate}
                        className="py-3"
                        />
                    )}
                </DataTable>
            </div>
            <ReactPaginate 
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={totalPages}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
            <Dialog header="Update User" visible={displayDialog} style={{ width: '50vw' }} footer={dialogFooter} onHide={() => setDisplayDialog(false)}>
                {selectedUser && <Patch user={selectedUser}/>}
            </Dialog>
            <Dialog header="Delete User" visible={displayDelete} style={{ width: '30vw' }} footer={deleteFooter} onHide={() => setDisplayDelete(false)}>
                {selectedUser && (<>
                    <h1 className="warning">Are you sure you want to Delete this user?</h1>
                    <div className="btnContainer">
                    <button className="yesbtn" onClick={() => {
                        handleDelete(selectedUser.id);
                        setSelectedUser(null);
                        setDisplayDelete(false);                
                    }}>Yes</button>
                    <button className="nobtn" onClick={() => {
                        setSelectedUser(null);
                        setDisplayDelete(false);
                    }}>No</button>
                    </div>
                </>)}
            </Dialog>
        </>
    );
};
// export const Home = () => {
//     const [data, setData] = useState([]);
//     const [firstSort, setFirstSort] = useState(false);
//     const [lastSort, setLastSort] = useState(false);
//     const [dataSort, setDataSort] = useState(true);

//     const [totalPages, setTotalPages] = useState(0);
//     const { token } = useContext(UserContext);
//     const navigate = useNavigate();
//     const { register, handleSubmit } = useForm();
//     const { role } = useContext(UserContext);
//     const [pageNumber, setPageNumber] = useState(0);
//     const usersPerPage = 5;

//     const fetchData = async (pageNumber = 0, sortBy = '') => {
//         try {
//             if (!token) {
//                 console.error("No token found");
//                 return;
//             }
//             const response = await Axios.get(`http://localhost:3000/users/paginated${sortBy ? `/${sortBy}` : ''}?page=${pageNumber + 1}&limit=${usersPerPage}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setData(response.data.items);
//             setTotalPages(response.data.totalPages);
//         } catch (error) {
//             console.log("Error fetching data: ", error.message);
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteUser(id, token);
//             fetchData(pageNumber, getSortParam());
//         } catch (error) {
//             console.log("Error deleting user: ", error.message);
//         }
//     };

//     const handleSearch = async (formData) => {
//         try {
//             if (!formData.name || formData.name.length < 3) {
//                 fetchData(pageNumber, getSortParam());
//                 return;
//             }
//             const userData = await getSearch(formData.name, token);
//             setData(userData ? userData.map(item => ({ ...item })) : []); 
//             setPageNumber(0);
//         } catch (error) {
//             console.log("Error fetching user: ", error.message);
//         }
//     };

//     const toggleFirstName = () => {
//         setDataSort(false);
//         setLastSort(false);
//         setFirstSort(!firstSort);
//     };

//     const toggleLastName = () => {
//         setDataSort(false);
//         setFirstSort(false);
//         setLastSort(!lastSort);
//     };

//     const getSortParam = () => {
//         if (firstSort) return 'first_name';
//         if (lastSort) return 'last_name';
//         return '';
//     };

//     useEffect(() => {
//         if (token) {
//             fetchData(pageNumber, getSortParam());
//         }
//     }, [token, pageNumber, firstSort, lastSort, dataSort]);

//     const changePage = ({ selected }) => {
//         setPageNumber(selected);
//     };

//     const actionBodyTemplate = (rowData) => {
//         return (
//             <div>
//                 <button 
//                     className="text-blue-600 hover:underline mr-2"
//                     onClick={() => navigate(`/patch/${rowData.id}`)}
//                 > Update
//                 </button>
//                 <button 
//                     className="text-red-600 hover:underline"
//                     onClick={() => handleDelete(rowData.id)}
//                 >
//                   Delete  
//                 </button>
//             </div>
//         );
//     };


//     return (
//         <>
//             <div className='max-w-md mt-4 mb-4 mx-auto'>
//                 <form className="flex items-center space-x-2" onChange={handleSubmit(handleSearch)}>
//                     <input className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 mb-2 dark:focus:border-blue-500" type="text" {...register("name")} />
//                 </form>
//             </div>
//             <div className="datatableContainer">
//                 <DataTable className="custom-datatable"
//                  value={data} sortMode="multiple" tableStyle={{ minWidth: '50rem' }}>
//                     <Column className="col" field="id" header="ID"/>
//                     <Column className="col" field="first_name" header={<button onClick={toggleFirstName}>FIRST NAME</button>}/>
//                     <Column className="col" field="last_name" header={<button onClick={toggleLastName}>LAST NAME</button>} />
//                     <Column className="col" field="email" header="EMAIL"/>
//                     <Column className="col" field="gender" header="GENDER"/>
//                     <Column className="col" field="job_title" header="JOB TITLE"/>
//                     {role === 1 && (
//                         <Column
//                         header="Actions"
//                         body={actionBodyTemplate}
//                         className="py-3"
//                         />
//                     )}
//                 </DataTable>
//             </div>
//             <ReactPaginate 
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 pageCount={totalPages}
//                 onPageChange={changePage}
//                 containerClassName={"paginationBttns"}
//                 previousLinkClassName={"previousBttn"}
//                 nextLinkClassName={"nextBttn"}
//                 disabledClassName={"paginationDisabled"}
//                 activeClassName={"paginationActive"}
//             />
//         </>
//     );
// };


// export const Home = () => {
//     const [data, setData] = useState([]);
//     const [firstSort, setFirstSort] = useState(false);
//     const [lastSort, setLastSort] = useState(false);
//     const [dataSort, setDataSort] = useState(true);

//     const [totalPages, setTotalPages] = useState(0);
//     const { token } = useContext(UserContext);
//     const navigate = useNavigate();
//     const { register, handleSubmit } = useForm();
//     const { role } = useContext(UserContext);
//     const [pageNumber, setPageNumber] = useState(0);
//     const usersPerPage = 5;

//     const fetchData = async (pageNumber = 0, sortBy = '') => {
//         try {
//             if (!token) {
//                 console.error("No token found");
//                 return;
//             }
//             const response = await Axios.get(`http://localhost:3000/users/paginated${sortBy ? `/${sortBy}` : ''}?page=${pageNumber + 1}&limit=${usersPerPage}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             setData(response.data.items);
//             setTotalPages(response.data.totalPages);
//         } catch (error) {
//             console.log("Error fetching data: ", error.message);
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await deleteUser(id, token);
//             fetchData(pageNumber, getSortParam());
//         } catch (error) {
//             console.log("Error deleting user: ", error.message);
//         }
//     };

//     const handleSearch = async (formData) => {
//         try {
//             if (!formData.name || formData.name.length < 3) {
//                 fetchData(pageNumber, getSortParam());
//                 return;
//             }
//             const userData = await getSearch(formData.name, token);
//             setData(userData ? userData.map(item => ({ ...item })) : []); 
//             setPageNumber(0);
//         } catch (error) {
//             console.log("Error fetching user: ", error.message);
//         }
//     };

//     const toggleFirstName = () => {
//         setDataSort(false);
//         setLastSort(false);
//         setFirstSort(!firstSort);
//     };

//     const toggleLastName = () => {
//         setDataSort(false);
//         setFirstSort(false);
//         setLastSort(!lastSort);
//     };

//     const getSortParam = () => {
//         if (firstSort) return 'first_name';
//         if (lastSort) return 'last_name';
//         return '';
//     };

//     useEffect(() => {
//         if (token) {
//             fetchData(pageNumber, getSortParam());
//         }
//     }, [token, pageNumber, firstSort, lastSort, dataSort]);

//     const changePage = ({ selected }) => {
//         setPageNumber(selected);
//     };

//     const displayUsers = data.map((user) => {
//         return (
//             <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</td>
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.first_name}</td>
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.last_name}</td>
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.email}</td>
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.gender}</td>
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.job_title}</td>
//                 {role === 1 && (
//                     <td>
//                         <div className="flex space-x-2">
//                             <button
//                                 className="text-blue-600 hover:underline"
//                                 onClick={() => navigate(`/patch/${user.id}`)}
//                             >
//                                 Update
//                             </button>
//                             <button
//                                 className="text-red-600 hover:underline"
//                                 onClick={() => handleDelete(user.id)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </td>
//                 )}
//             </tr>
//         );
//     });

//     return (
//         <div className="mx-21 relative overflow-x-auto pt-5">
//             <div className='max-w-md mx-auto'>
//                 <form className="flex items-center space-x-2" onChange={handleSubmit(handleSearch)}>
//                     <input className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 mb-2 dark:focus:border-blue-500" type="text" {...register("name")} />
//                 </form>
//             </div>
//             <div className="flex justify-center">
//                 <table className="w-50% rounded text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                     <thead className="text-xs w-full text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                         <tr>
//                             <th className="px-6 py-3">ID</th>
//                             <th className="px-6 py-3"><button className='firstname' onClick={toggleFirstName}>FIRST NAME</button></th>
//                             <th className="px-6 py-3"><button className='lastname' onClick={toggleLastName}>LAST NAME</button></th>
//                             <th className="px-6 py-3">Email</th>
//                             <th className="px-6 py-3">Gender</th>
//                             <th className="px-6 py-3">Job Title</th>
//                             {role === 1 && (<th className="px-6 py-3">Actions</th>)}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {displayUsers}
//                     </tbody>
//                 </table>
//             </div>
//             <ReactPaginate 
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 pageCount={totalPages}
//                 onPageChange={changePage}
//                 containerClassName={"paginationBttns"}
//                 previousLinkClassName={"previousBttn"}
//                 nextLinkClassName={"nextBttn"}
//                 disabledClassName={"paginationDisabled"}
//                 activeClassName={"paginationActive"}
//             />
//         </div>
//     );
// };