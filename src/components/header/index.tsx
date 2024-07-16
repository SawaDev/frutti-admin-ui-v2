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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CustomLink from "@/components/customLink"
import useAuthStore from "@/store/auth"
import { ListItem, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu"
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import useCurrencies from "@/hooks/useCurrencies"
import { useCurrencyStore } from "@/store/currency"
import UpdateCurrency from "@/features/Currencies/update-currency"

const Header = () => {
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(false);

  const targetRef = useRef<(HTMLButtonElement | null)[]>([]);

  const { activeCurrency, setCurrencies, setActiveCurrency } = useCurrencyStore()
  const { logout } = useAuthStore()

  const { getAllCurrenciesQuery } = useCurrencies()
  const { data, isLoading, isError } = getAllCurrenciesQuery()

  useEffect(() => {
    setCurrencies(data?.data)
    setActiveCurrency(data?.data[0] !== undefined ? data?.data[0] : null)
  }, [data])

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

  if (isLoading) (
    <div className="flex w-full flex-col">
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  )

  if (isError) return <>Can't load currencies!</>

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
              Sklad
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
                      href="/warehouses"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Sklad
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Sklad va unga doir bo'lim.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/ingredients" title="Siryolar">
                  Siryolar haqida to'liq ma'lumot.
                </ListItem>
                <ListItem href="/ingredients-purchases" title="Siryo xaridlari">
                  Siryo xaridlariga doir ma'lumotlar.
                </ListItem>
                <ListItem href="/ingredients-transactions" title="Ishlatilingan Siryolar">
                  Ishlatilingan siryolar haqida to'liq ma'lumot.
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
              Harajatlar
            </NavigationMenuTrigger>
            <NavigationMenuContent
              onPointerMove={(event) => event.preventDefault()}
              onPointerLeave={(event) => event.preventDefault()}
            >
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr_1fr]">
                <li className="row-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                      to="/expenses"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Harajatlar
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Harajatlarga ga doir bo'lim.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {/* <ListItem href="/transactions" title="Pul o'tkazmalar">
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
                </ListItem> */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <div className="transition-colors hover:text-foreground text-muted-foreground cursor-pointer" onClick={() => setOpen(true)}>
            Kurs
          </div>
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
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <CustomLink
              to="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">User</span>
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
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Menu</span>
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
      <UpdateCurrency
        open={open}
        setOpen={setOpen}
        defaultCurrency={activeCurrency}
      />
    </header>
  )
}

export default Header