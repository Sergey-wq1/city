import dynamic from "next/dynamic";

const City = dynamic(() => import('@/containers/City/City'), { ssr: false });

export default function Home() {
  return (
   <City />
  );
};
