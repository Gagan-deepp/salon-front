"use client"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllUsers } from "@/lib/actions/user_action"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"

export function UserCombobox({ value, onValueChange, disabled }) {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const hasFetchedInitially = useRef(false)

    const fetchUsers = useCallback(async (searchQuery = "") => {
        setLoading(true)
        try {
            const result = await getAllUsers({ limit: 50, search: searchQuery })
            if (result.success && result.data?.data) {
                setUsers(result.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch users in combobox:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (open && !hasFetchedInitially.current) {
            hasFetchedInitially.current = true
            fetchUsers()
        }
    }, [open, fetchUsers])

    // Debounced search
    useEffect(() => {
        if (!open || !hasFetchedInitially.current) return

        const timer = setTimeout(() => {
            fetchUsers(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search, open, fetchUsers])

    const selectedUser = users.find(user => (user.id || user._id) === value)

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedUser ? (
                        <div className="flex items-center gap-2 truncate">
                            <span className="font-medium">{selectedUser.displayName || selectedUser.name}</span>
                            <span className="text-xs text-muted-foreground">({selectedUser.email})</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground font-normal">Select user...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search users by name or email..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup>
                                    {users.map((user) => {
                                        const userId = user.id || user._id;
                                        return (
                                            <CommandItem
                                                key={userId}
                                                value={userId}
                                                onSelect={() => {
                                                    onValueChange(userId === value ? "" : userId)
                                                    setOpen(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4 shrink-0",
                                                        value === userId ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col flex-1 overflow-hidden">
                                                    <span className="font-medium truncate">{user.displayName || user.name}</span>
                                                    <span className="text-xs text-white truncate">{user.email}</span>
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
