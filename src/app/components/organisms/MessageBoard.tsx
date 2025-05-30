import { announcements } from './MessageData'

const MessageBoard = () => {
  // if (announcements.length > 5) {
  //   throw new Error('お知らせは5件までです。')
  // }

  return (
    <div className="px-2 py-4 my-20 bg-white/15 dark:bg-night-black/50 rounded-md">
      <h3 className="mb-2 select-none">News</h3>
      <ul className="m-0 list-none p-0">
        {announcements.map((announcement, index) => (
          <li
            key={index}
            className={`border-b border-gray ${index === 0 ? 'border-t' : ''}`}
          >
            <div className="flex select-none flex-wrap items-center border-b border-gray p-4 text-main-black no-underline md:flex-nowrap">
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
                      className="text-teal underline dark:text-night-teal"
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
