interface CommunityList {
  items: Array<Community>;
  page: number;
  page_size: number;
  total_page: number;
  prev: number | null;
  next: number | null;
}

interface Community {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

interface PostList {
  items: Array<Post>;
  page: number;
  page_size: number;
  total_page: number;
  prev: number | null;
  next: number | null;
}

interface Post {
  id: number;
  title: string;
  nickname: string;
  member_id: number;
  content: string;
  reply_count: number;
  previous_id: number;
  next_id: number;
  creation_time: Date;
  modification_time: Date;
}

interface ReplyList {
  items: Array<Reply>;
  page: number;
  page_size: number;
  total_page: number;
  prev: number | null;
  next: number | null;
}

interface Reply {
  id: number;
  nickname: string;
  member_id: number;
  content: string;
  creation_time: Date;
  modification_time: Date;
}
