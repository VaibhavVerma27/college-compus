interface Props {
  name: string;
  student_id: string;
  profile: string;
}

export default function HeadCard({ name, student_id, profile }: Props) {
  return (
    <div className="flex flex-row items-center justify-around m-5 p-6 w-full max-w-xl bg-gradient-to-b from-[#0B0C10] to-[#1F2833] border-2 rounded-xl border-blue-500 shadow-lg shadow-blue-900 flex-shrink-0">
      <img
        src={profile || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
        className="w-16 h-16 border-4 rounded-full  border-blue-500 shadow-md shadow-blue-900"
        alt="Profile"
      />
      <div className="text-lg md:text-xl font-bold border-blue-500 text-blue-500 font-archivo text-center">
        {name}
      </div>
      <div className="text-lg md:text-xl font-bold text-white text-center">
        {student_id}
      </div>
    </div>
  );
}