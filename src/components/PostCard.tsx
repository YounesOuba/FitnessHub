
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CategoryLabel } from '@/lib/constants';
function getFirstParagraph(html: string) {
  const match = html.match(/<p[\s\S]*?>[\s\S]*?<\/p>/i);
  if (match) return match[0];
  const split = html.split(/<br\s*\/?>(\s*<br\s*\/?>)?/i);
  if (split.length > 0 && split[0].trim()) return `<p>${split[0]}</p>`;
  return html.length > 200 ? html.slice(0, 200) + '...' : html;
}

interface PostCardProps {
  title: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  categories: CategoryLabel[];
  href: string;
}

const PostCard = ({
  title,
  content,
  date,
  readTime,
  image,
  categories,
  href,
}: PostCardProps) => {
  return (
    <Link to={`/article/${href}`} className="block rounded-lg overflow-hidden shadow-lg border border-border bg-[#212121] transition-transform hover:-translate-y-1 hover:shadow-xl group">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span key={index} className="bg-[#cfff6a] text-black px-3 py-1 text-xs font-semibold rounded-full shadow">
                {category}
              </span>
            ))}
          </div>
      </div>

      <div className="p-5 text-white">
        <h3 className="text-xl font-bold mb-2 leading-snug group-hover:text-[#cfff6a] transition-colors hover:underline">
          {title}
        </h3>

        <div
          className="text-sm text-gray-300 mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: getFirstParagraph(content) }}
        />

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
