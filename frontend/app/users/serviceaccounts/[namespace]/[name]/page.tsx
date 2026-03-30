"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ResourceDetailLayout } from "@/components/detail/resource-detail-layout"
import { useServiceAccount } from "@/hooks/use-resource"
import { deleteServiceAccount } from "@/lib/api-client"

export default function ServiceAccountDetailPage() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>()
  const router = useRouter()
  const { data: sa, isLoading, mutate } = useServiceAccount(namespace, name)

  return (
    <ResourceDetailLayout
      resource={sa}
      isLoading={isLoading}
      backHref="/users/serviceaccounts"
      backLabel="ServiceAccounts"
      namespace={namespace}
      extraFields={[
        { label: "Secrets", value: sa?.secrets },
      ]}
      onRefresh={() => mutate()}
      onDelete={async () => {
        if (!confirm(`Delete serviceaccount ${name}?`)) return
        await deleteServiceAccount(namespace, name)
        router.push('/users/serviceaccounts')
      }}
    />
  )
}
