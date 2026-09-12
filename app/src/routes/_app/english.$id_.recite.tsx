import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/english/$id_/recite')({
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})
