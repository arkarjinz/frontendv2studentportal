
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "student"],
      },

      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin"],
      },
      {
        icon: "/gift.svg",
        label: "Gift",
        href: "/list/gift",
        visible: ["admin"],
      },

    ],
  },
];

const Menu = () => {
  return (
      <div className="mt-4 text-sm">
        {menuItems.map((i) => (
            <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
              {i.items.map((item) => {
                return (
                    <Link
                        href={item.href}
                        key={item.label}
                        className="flex items-center justify-center lg:justify-start gap-4 text-gray-600 py-2 md:px-2 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <Image src={item.icon} alt="" width={20} height={20} />
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                );
              })}
            </div>
        ))}
      </div>
  );
};

export default Menu;
