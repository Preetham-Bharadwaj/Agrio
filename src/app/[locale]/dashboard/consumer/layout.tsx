import ConsumerLayout from "@/components/consumer/ConsumerLayout";

export default function ConsumerLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsumerLayout>{children}</ConsumerLayout>;
}
