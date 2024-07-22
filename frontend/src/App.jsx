import './App.css';
//import { Home } from './pages/Home';
//import { GetSearch } from './components/GetSearch';
//import { Post } from './components/Post';
//import { Patch } from './components/Patch';
//import { Delete } from './components/Delete';
// import { useContext } from 'react';
import { UserContextProvider } from './context/UserContextProvider';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Welcome } from './pages/Welcome';
//import { AddTask } from './pages/AddTask';
// import { NavbarAdmin } from './components/NavbarAdmin';
// import { Navbar } from './components/Navbar';
//import { AuthGuard } from './pages/PrivateRoute';
import LogedInAdmin from './pages/LogedInAdmin';
import LogedIn from './pages/LogedIn';

const App = () => {
  // const {role} = useContext(UserContext);
  // const check = role;
//   return (
//   <div>
//     <Router>
//     {/* {check === 0 ? (<h1> </h1>) : check === 1 ? <NavbarAdmin /> : <Navbar />} */}
//       <Routes>
//           <Route path='/' element={<Welcome />}/>
//           <Route path='/home' element={<Home />}/>
//           {/* <Route path='/getSearch' element={<GetSearch />}/> */}
//           <Route path='/post' element={<Post />}/>
//           <Route path='/patch/:id' element={<Patch />}/>
//           <Route path='/addtask' element={<AddTask />}/>
//           {/* <Route path='/delete' element={<Delete />}/> */}
//           <Route path='*' element={<h1>Wrong Page.</h1>}/>
//       </Routes>
//     </Router>
//   </div>
// );
return (
  <UserContextProvider>
    <Router>
      <Routes>
        <Route path="/login" element={
            <Welcome />
          } 
          />
        <Route 
          path="/loggedinadmin" 
          element={
            // <AuthGuard>
              <LogedInAdmin />
            // </AuthGuard>
          } 
        />
        <Route 
          path="/loggedinuser" 
          element={
            // <AuthGuard>
              <LogedIn />
            // </AuthGuard>
          } 
        />
        <Route path="*" element={<h1>Wrong Page.</h1>} />
      </Routes>
    </Router>
  </UserContextProvider>
);
}

export default App;
