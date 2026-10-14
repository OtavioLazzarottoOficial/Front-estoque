import { Link } from "@tanstack/react-router"

import { Button } from "@workspace/ui/components/button"
import { UserSetting } from "./user-setting"

function Navbar() {
  return (
    <div className="flex gap-2 bg-muted p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-extrabold">My Estoque</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/"}>
          <Button className={"font-extrabold"} variant={"ghost"}>
            Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/product-list"}>
          <Button className={"font-extrabold"} variant={"ghost"}>
            Produtos
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/category-list"}>
          <Button className={"font-extrabold"} variant={"ghost"}>
            Categorias
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/stock-list"}>
          <Button className={"font-extrabold"} variant={"ghost"}>
            Estoque
          </Button>
        </Link>
      </div>

      <div className="relative ml-auto flex cursor-pointer items-center gap-2">
        <UserSetting />
      </div>
    </div>
  )
}

export default Navbar
