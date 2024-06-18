import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuth"
import { authSchema } from "@/schema/auth"
import useAuthStore from "@/store/auth"
import { AuthType } from "@/types/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const { authMutation } = useAuth()
  const { login } = useAuthStore()

  const navigate = useNavigate()
  const auth = authMutation()

  const form = useForm<AuthType>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      user_name: '',
      password: '',
    }
  })

  const onSubmit = (values: AuthType) => {
    auth.mutateAsync(values)
      .then((res) => login(res.data.user_name, res.data.permissions, res.data.token))
      .then(() => {
        window.location.reload()
        navigate("/")
      })
  }

  return (
    <div className="h-screen grid place-items-center">
      <Card className=" w-full max-w-sm">
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl">Kirish</CardTitle>
              <CardDescription>
                Akkauntingizga kirish uchun quyidagini to'ldiring.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name={`user_name`}
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`password`}
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <FormLabel>Parol</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button disabled={auth.isPending} className="w-full">Kirish</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default Login