import Link from "next/link"

interface SectionCardProps {
  title: string
  description: string
  href: string
  disabled?: boolean
}

export default function SectionCard({
  title,
  description,
  href,
  disabled = false,
}: SectionCardProps) {
  const content = (
    <div
      className={`border rounded-xl p-5 transition-all ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg hover:border-black"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {!disabled && <span className="text-xl">→</span>}
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  )

  if (disabled) return content

  return <Link href={href}>{content}</Link>
}