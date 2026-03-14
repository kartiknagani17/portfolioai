import PortfolioEditor from "./editor"

export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params
  return <PortfolioEditor subdomain={subdomain} />
}
