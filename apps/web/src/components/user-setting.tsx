import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { Settings, LucideSquareArrowRightExit } from "lucide-react"

interface UserSettingProps {
  logout: () => void
  user_email?: string | undefined
}

export function UserSetting({ logout, user_email }: UserSettingProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className="font-extrabold" variant="ghost" />}
      >
        {user_email}
        <Settings />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={logout}>
            <LucideSquareArrowRightExit />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
