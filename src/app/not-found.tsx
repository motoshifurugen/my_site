import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'notfound - ページが見つかりません',
};

export default function NotFound() {
  return (
    <div>
      <p className="text-2xl leading-loose mb-12 font-bold mx-20">
        「え？404 Not Found？」<br />
        わーーーーー！ごめんなさい。ページどこだ？どこだ？
      </p>
    </div>
  );
}