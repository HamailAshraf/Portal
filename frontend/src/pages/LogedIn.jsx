
import { Home } from '../pages/Home';
import { UserTask } from './UserTask';
// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function LogedIn() {
  return (
    <div className='bg-gradient-to-r from-slate-100 to-slate-400 h-screen w-screen flex items-center justify-center scroll-smooth'>
      <div>
        <Home />
        <UserTask />
      </div>
    </div>
  )
}

export default LogedIn
