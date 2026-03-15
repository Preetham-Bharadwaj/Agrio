import RetailerLayout from "@/components/retailer/RetailerLayout";

export default function RetailerLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RetailerLayout>{children}</RetailerLayout>;
}
