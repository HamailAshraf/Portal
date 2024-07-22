//import { Link} from 'react-router-dom';
import { Logout } from './LogOut';
export const Navbar = () => {
  return (
    <div className='bg-white border-gray-200 dark:bg-gray-900 w-screen'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <h1>Portal Logo</h1>
        <Logout />
      </div>
    </div>
  )
}