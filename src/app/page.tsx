import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="bg-background border-b px-4 sm:px-6 flex items-center h-16">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
          <FrameIcon className="w-6 h-6" />
          <span>NFT Badges</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6 font-medium text-sm">
          <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
            Events
          </Link>
          <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
            My Badges
          </Link>
          <Link href="#" className="text-muted-foreground hover:underline" prefetch={false}>
            Create Event
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    className="rounded-full border"
                    alt="Avatar"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <span className="sr-only">Toggle user menu</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <WalletIcon className="h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <LogOutIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        </nav>
      </header>
      <main>
        <section>
          <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 md:px-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h1 className="text-4xl font-bold">Claim Your Event Badges</h1>
                <p className="text-muted-foreground mt-4 max-w-md">
                  Connect your Solana wallet to view and claim the NFT badges you've earned by attending events.
                </p>
                <Button className="mt-6">Connect Wallet</Button>
              </div>
              <div className="flex justify-end">
                <img
                  src="/poa pup1.jpeg"
                  width={500}
                  height={400}
                  alt="Hero Image"
                  className="rounded-lg"
                  style={{ aspectRatio: "500/400", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold">Events</h2>
            <p className="text-muted-foreground mt-2">
              View and claim the NFT badges you've earned by attending events.
            </p>
          </div>
          <div className="max-w-6xl mx-auto mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Card className="relative group">
              <CardHeader className="bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt="Event Logo" />
                      <AvatarFallback>EV</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Solana Meetup</div>
                      <div className="text-xs text-muted-foreground">Oct 15, 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:opacity-100 opacity-0 transition-opacity">
                    Claim
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Solana Meetup</div>
                    <div className="text-sm text-muted-foreground">
                      Attend the Solana Meetup to earn this NFT badge.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm font-medium">100 Claimed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative group">
              <CardHeader className="bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt="Event Logo" />
                      <AvatarFallback>EV</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Solana Hackathon</div>
                      <div className="text-xs text-muted-foreground">Nov 1-3, 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:opacity-100 opacity-0 transition-opacity">
                    Claim
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Solana Hackathon</div>
                    <div className="text-sm text-muted-foreground">
                      Participate in the Solana Hackathon to earn this NFT badge.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm font-medium">50 Claimed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative group">
              <CardHeader className="bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt="Event Logo" />
                      <AvatarFallback>EV</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Solana Conf 2023</div>
                      <div className="text-xs text-muted-foreground">Dec 1-3, 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:opacity-100 opacity-0 transition-opacity">
                    Claim
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Solana Conf 2023</div>
                    <div className="text-sm text-muted-foreground">
                      Attend the Solana Conf 2023 to earn this NFT badge.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm font-medium">200 Claimed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative group">
              <CardHeader className="bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt="Event Logo" />
                      <AvatarFallback>EV</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Solana Webinar</div>
                      <div className="text-xs text-muted-foreground">Sep 1, 2023</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:opacity-100 opacity-0 transition-opacity">
                    Claim
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Solana Webinar</div>
                    <div className="text-sm text-muted-foreground">
                      Attend the Solana Webinar to earn this NFT badge.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm font-medium">75 Claimed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

function FrameIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  )
}


function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}


function TrophyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}


function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}


function WalletIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}
