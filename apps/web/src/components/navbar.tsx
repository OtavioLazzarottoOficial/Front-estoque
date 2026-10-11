import { Link } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"
import { Home } from "lucide-react"

function Navbar() {
  return (
    <div className="flex gap-2 bg-gray-300 p-2">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-extrabold">My Estoque</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/"}>
          <Button variant={"ghost"}>
            <Home height={22} width={22} />
            Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/about"}>
          <Button variant={"ghost"}>About</Button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
