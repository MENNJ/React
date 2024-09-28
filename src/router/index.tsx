import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import InfiniteGrid from '../pages/InfiniteGrid/'

const RouterComponent = () => (
  <Router>
    <Routes>
      <Route path='/' element={<InfiniteGrid />} />
    </Routes>
  </Router>
)

export default RouterComponent
