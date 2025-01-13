import { announcements } from './MessageData'

const MessageBoard = () => {
  // if (announcements.length > 5) {
  //   throw new Error('お知らせは5件までです。')
  // }

  return (
    <div className="py-24">
      <h3 className="mb-2">News</h3>
      <ul className="m-0 list-none p-0">
        {announcements.map((announcement, index) => (
          <li
            key={index}
            className={`border-b border-gray ${index === 0 ? 'border-t' : ''}`}
          >
            <div className="flex flex-wrap items-center border-b border-gray p-4 text-main-black no-underline md:flex-nowrap">
              <p className="m-0 min-w-[80px] text-sm">{announcement.date}</p>
              <p className="m-0 min-w-[120px] text-center">
                <span className="inline-block bg-gray px-4 py-1 text-center text-xs leading-none text-main-black">
                  {announcement.category}
                </span>
              </p>
              <p className="m-0 mt-2 w-full text-base md:mt-0">
                {announcement.title}
                {announcement.link && (
                  <>
                    {' '}
                    <a
                      href={announcement.link.url}
                      className="text-teal underline"
                    >
                      {announcement.link.text}
                    </a>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MessageBoard
