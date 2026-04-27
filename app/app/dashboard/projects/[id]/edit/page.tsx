import { redirect } from "next/navigation"

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  redirect(`/submit?projectId=${id}&step=project`)
}
