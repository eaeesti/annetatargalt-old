import NextImage2 from "../elements/image2";
import Markdown from "react-markdown";

export default function Team({ data }) {
  return (
    <div className="bg-white">
      <div className="px-4 py-12 mx-auto max-w-sm sm:max-w-3xl lg:max-w-7xl sm:px-6 lg:px-8">
        <div className="space-y-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <ul
            role="list"
            className="space-y-12 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:gap-y-12 lg:space-y-0"
          >
            {data.teamMembers.map((member) => (
              <li key={member.name}>
                <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:gap-8">
                  <div className="h-0 aspect-w-4 aspect-h-3 sm:aspect-w-3 sm:aspect-h-4">
                    <NextImage2
                      media={member.image}
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="space-y-4">
                      <div className="space-y-1 text-lg font-bold leading-6">
                        <h3>{member.name}</h3>
                        <p className="text-primary-600">{member.role}</p>
                      </div>
                      <div className="text-lg">
                        <div className="text-slate-600 prose">
                          <Markdown>{member.bio}</Markdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
