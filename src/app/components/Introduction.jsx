export default function Introduction({name, role}) {
  return (
    <div className="h-[400px] flex items-center">
      {/* Greetings */}
      <div className="flex flex-col w-2/3 gap-1.5 justify-center">
        <span className="font-semibold text-gradient-to-r from-slate-50 to text-slate-200 text-[28px] block">
          Hi, there!
        </span>
        <span className="font-semibold text-gradient-to-r from-slate-50 to text-slate-200 text-4xl block">
          {name}, {role}. We are a
        </span>
        <span className="font-semibold ttext-gradient-to-r from-slate-50 to text-slate-200 text-4xl block">
          network of experienced engineers.
        </span>
      </div>

      {/* Profile*/}
      <div className="flex w-1/3 relative items-center justify-center h-full">
        <div className="size-44 p-3 bg-[#18181B] rounded-[25px] relative">
          {/* Tags */}

          <div className="absolute px-3 py-2 rounded-full -top-1/4 whitespace-nowrap left-1/2 bg-[#18181B] text-white font-normal text-sm">
            Kafka injection
          </div>

          <div className="absolute px-3 py-2 rounded-full top-8 whitespace-nowrap -right-1/4 translate-x-[100%] bg-[#18181B] text-white font-normal text-sm">
            Kafka injection
          </div>

          <div className="absolute px-3 py-2 rounded-full -bottom-8 whitespace-nowrap -right-3 translate-x-[100%] bg-[#18181B] text-white font-normal text-sm">
            Kafka injection
          </div>

          <div className="absolute px-3 py-2 rounded-full -bottom-1/3 whitespace-nowrap left-0 -translate-x-[50%] bg-[#18181B] text-white font-normal text-sm">
            Kafka injection
          </div>

          <div className="absolute px-3 py-2 rounded-full bottom-1/4 whitespace-nowrap -left-1/4 -translate-x-[100%] bg-[#18181B] text-white font-normal text-sm">
            Kafka injection
          </div>

          {/* Picture */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
            className="rounded-[25px] object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
