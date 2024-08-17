import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";


const CustomLink = ({ children, to, ...props }: LinkProps) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link
        className={`transition-colors hover:text-foreground ${match ? 'text-foreground' : 'text-muted-foreground'}`}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
}

export default CustomLink;