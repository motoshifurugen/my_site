import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'notfound - ページが見つかりません',
};

export default function NotFound() {
  return (
    <div>
      <h1>notfound - ページが見つかりません</h1>
      <p>わーーーーー！ごめんなさい。ページどこだ？どこだ？</p>
    </div>
  );
}