'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  firstname: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session, update } = useSession()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      firstname: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      setValue('firstname', session.user.firstname!)
      setValue('email', session.user.email!)
    }
  }, [router, session, setValue])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { firstname, email, password } = form
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          email,
          password,
        }),
      })
      if (res.status === 200) {
        toast.success('Profile updated successfully')
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            firstname,
            email,
          },
        }
        await update(newSession)
      } else {
        const data = await res.json()
        toast.error(data.message || 'error')
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="max-w-sm  mx-auto card bg-slate-900 my-4">
      <div className="card-body">
        <h1 className="card-title text-yellow-500">Profile</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="firstname"
              {...register('firstname', {
                required: 'Name is required',
              })}
              className="input input-bordered bg-slate-800 w-full max-w-sm"
            />
            {errors.firstname?.message && (
              <div className="text-error">{errors.firstname.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid',
                },
              })}
              className="input input-bordered bg-slate-800 w-full max-w-sm"
            />
            {errors.email?.message && (
              <div className="text-error">{errors.email.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {})}
              className="input input-bordered bg-slate-800 w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Passwords should match!'
                },
              })}
              className="input input-bordered bg-slate-800 w-full max-w-sm"
            />
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
            )}
          </div>

          <div className="my-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary bg-yellow-500 w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
