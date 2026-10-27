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
import { LogOut, UserRound } from "lucide-react"

interface UserSettingProps {
  logout: () => void
  user_email?: string | undefined
}

function getInitials(email?: string) {
  if (!email) return "U"
  const localPart = email.split("@")[0]
  const parts = localPart.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return localPart.slice(0, 2).toUpperCase()
}

export function UserSetting({ logout, user_email }: UserSettingProps) {
  const initials = getInitials(user_email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="flex items-center gap-2 font-medium"
            variant="ghost"
            aria-label="Menu do usuário"
          />
        }
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials}
        </div>
        <span className="hidden max-w-[160px] truncate text-sm sm:inline">
          {user_email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium">Minha Conta</span>
            <span className="truncate text-xs text-muted-foreground">
              {user_email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" disabled>
            <UserRound className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
