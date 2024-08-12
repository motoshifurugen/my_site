import PageFace from '../components/PageFace';

export default function Contact() {
  return (
    <section className="contact">
      <PageFace
        title="お問い合わせ"
        subtitle=""
        mainMessage={
          <></>
        }
      />
      <form
        action="https://ssgform.com/s/TQptUiQBhkQa"
        method="post"
        className="space-y-8 mx-6 md:mx-auto max-w-4xl bg-white px-4 md:px-16 py-4 rounded-lg dark:bg-font-main dark:text-white mb-20"
      >
        <div className="hidden">
          <input type="text" name="wana" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm md:text-md font-bold mb-4">
            お名前
            <span className="ml-2 md:ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs md:text-sm">必須</span>
          </label>
          <input
            type="text"
            name="お名前"
            id="name"
            required
            className="mt-1 block w-full px-3 py-2 md:py-4 border border-gray rounded-md focus:outline-none focus:border-font-main text-sm md:text-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm md:text-md font-bold mb-4">
            メールアドレス
            <span className="ml-2 md:ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs md:text-sm">必須</span>
          </label>
          <input
            type="email"
            name="メールアドレス"
            id="email"
            required
            className="mt-1 block w-full px-3 py-2 md:py-4 border border-gray rounded-md focus:outline-none focus:border-font-main text-sm md:text-md"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm md:text-md font-bold mb-4">
            お問い合わせ内容
            <span className="ml-2 md:ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs md:text-sm">必須</span>
          </label>
          <textarea
            name="お問い合わせ内容"
            id="message"
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 md:py-4 border border-gray rounded-md focus:outline-none focus:border-font-main text-sm md:text-md"
          ></textarea>
        </div>
        <div className="flex justify-center">
        <button
          type="submit"
          className="shadow-[inset_0_0_0_2px_#616467] px-20 md:px-32 py-4 my-5 md:my-10 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
          送信する
        </button>
        </div>
      </form>
    </section>
  );
}