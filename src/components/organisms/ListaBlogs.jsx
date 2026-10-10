import TarjetaBlog from "../molecules/TarjetaBlog";

export default function ListaBlogs({ blogs }) {
  return <div className="d-flex flex-column gap-4">{blogs.map((blog) => <TarjetaBlog key={blog.id} post={blog} />)}</div>;
}
