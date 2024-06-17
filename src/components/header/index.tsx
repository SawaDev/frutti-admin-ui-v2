import { Link } from "react-router-dom"
import {
  CircleUser,
  Menu,
  Package2,
  // Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CustomLink from "@/components/customLink"
import useAuthStore from "@/store/auth"
import { ListItem, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu"
import { useEffect, useRef, useState } from "react"

const Header = () => {
  const [disable, setDisable] = useState(false);
  const targetRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const observerCallback = (mutationsList: any) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state" &&
          mutation.target.dataset.state === "open"
        ) {
          setDisable(true);
          const timeout = setTimeout(() => {
            setDisable(false);
            clearTimeout(timeout);
          }, 1000);
        }
      }
    };

    const observer = new MutationObserver(observerCallback);

    targetRef.current.forEach((element) => {
      if (element) {
        observer.observe(element, {
          attributes: true,
        });
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const { logout } = useAuthStore()

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 z-50 md:px-6">
      <NavigationMenu orientation="horizontal">
        <NavigationMenuList className="hidden flex-col gap-3 text-lg font-medium md:flex md:flex-row md:items-center md:text-sm">
          <Link
            to="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Mahsulotlar</span>
          </Link>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
              ref={(ref) => (targetRef.current[0] = ref)}
              onClick={(e) => {
                if (disable) {
                  e.preventDefault();
                }
              }}
            >
              Mahsulotlar
            </NavigationMenuTrigger>
            <NavigationMenuContent
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
            >
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/products"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Mahsulotlar
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Sotuvdagi mahsulotlar, ingredientlar, kontainerlar haqidagi bo'lim.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/products" title="Mahsulotlar">
                  Mahsulorlatga doir ma'lumotlarni ko'rish va ular ustida amallar bajarish.
                </ListItem>
                <ListItem href="/ingredients" title="Ingredientlar">
                  Ingredientlarga doir ma'lumotlarni ko'rish va ular ustida amallar bajarish.
                </ListItem>
                <ListItem href="/containers" title="Konteynerlar">
                  Konteynerlarga doir ma'lumotlarni ko'rish va ular ustida amallar bajarish.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
              ref={(ref) => (targetRef.current[1] = ref)}
              onClick={(e) => {
                if (disable) {
                  e.preventDefault();
                }
              }}
            >
              Sotuv
            </NavigationMenuTrigger>
            <NavigationMenuContent
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
            >
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr_1fr]">
                <li className="row-span-2">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                      href="/sales"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Sotuv
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Pul o'tkazmalari, sotuvlar harajatlar ga doir bo'lim.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/transactions" title="Pul o'tkazmalar">
                  Pul o'tkazmalariga doir ma'lumotlar.
                </ListItem>
                <ListItem href="/sales" title="Sotuvlar">
                  Sotuvlar haqida to'liq ma'lumot.
                </ListItem>
                <ListItem href="/wallets" title="Hamyonlar">
                  Ingredientlarga doir ma'lumotlarni ko'rish va ular ustida amallar bajarish.
                </ListItem>
                <ListItem href="/clients" title="Klientlar">
                  Klientlar haqida ma'lumotlar.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <CustomLink to="/">
            Dashboard
          </CustomLink>
          <CustomLink to="/products">
            Products
          </CustomLink>
          <CustomLink to="/analytics">
            Analytics
          </CustomLink>
          <CustomLink to="/users">
            Foydalanuvchilar
          </CustomLink>
          <CustomLink to="/posts">
            Postlar
          </CustomLink>
        </NavigationMenuList>
      </NavigationMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <CustomLink
              to="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </CustomLink>
            <CustomLink to="/">
              Dashboard
            </CustomLink>
            <CustomLink to="/orders">
              Orders
            </CustomLink>
            <CustomLink to="/products">
              Products
            </CustomLink>
            <CustomLink to="/clients">
              Klientlar
            </CustomLink>
            <CustomLink to="/analytics">
              Analytics
            </CustomLink>
            <CustomLink to="/users">
              Foydalanuvchilar
            </CustomLink>
            <CustomLink to="/posts">
              Postlar
            </CustomLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div> */}
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mening akkauntim</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
            <DropdownMenuItem>Yordam</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>Chiqish</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header