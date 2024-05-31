import { SVGProps } from "react";

export function Pizza(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4em"
      height="4em"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="#45413c"
        d="M12.5 45.5a11.5 1.5 0 1 0 23 0a11.5 1.5 0 1 0-23 0"
        opacity={0.15}
      ></path>

      <path
        fill="#ffe500"
        d="M40.63 11.39a37.49 37.49 0 0 0-33.26 0L9.63 16a18 18 0 0 1 1.87 8v4.44a2.07 2.07 0 0 0 1.66 2.08a2 2 0 0 0 2.34-2v-.68l7.61 15.36a1 1 0 0 0 1.78 0l2.61-5.27V40a1.5 1.5 0 0 0 3 0v-5.8a9.88 9.88 0 0 1 1-4.43c1.26-2.56 2.61-5.27 4-8v2.73a1.5 1.5 0 0 0 3 0V18a10.05 10.05 0 0 1 1-4.44Z"
      ></path>
      <path
        fill="#ebcb00"
        d="M24 10.75a37.31 37.31 0 0 1 15.35 3.3c.06-.15.12-.31.19-.45l1.09-2.21a37.49 37.49 0 0 0-33.26 0L8.68 14A37.32 37.32 0 0 1 24 10.75"
      ></path>
      <path
        fill="#ff6242"
        stroke="#45413c"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M30.5 22.5a4.5 4.5 0 0 0 0 9h.19c1.11-2.23 2.29-4.62 3.49-7.06a4.47 4.47 0 0 0-3.68-1.94m-7 10.5a4.49 4.49 0 0 0-4.5-4.5a4.44 4.44 0 0 0-2.71.93l3.91 7.89A4.49 4.49 0 0 0 23.5 33M26 14.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0-9 0"
      ></path>
      <path
        fill="#f0d5a8"
        d="M24 7.5a37.27 37.27 0 0 1 16.63 3.89s2.47.31 2.87-1.89c1-5.5-15.33-7-19.5-7S3.5 4 4.5 9.5c.4 2.2 2.87 1.89 2.87 1.89A37.27 37.27 0 0 1 24 7.5"
      ></path>
      <path
        fill="#f7e5c6"
        d="M4.54 9.66C8.18 6.07 20.4 5 24 5s15.82 1.07 19.46 4.66V9.5c1-5.5-15.33-7-19.5-7S3.5 4 4.5 9.5c.01.06.03.1.04.16"
      ></path>
      <path
        fill="none"
        stroke="#45413c"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 7.5a37.27 37.27 0 0 1 16.63 3.89s2.47.31 2.87-1.89c1-5.5-15.33-7-19.5-7S3.5 4 4.5 9.5c.4 2.2 2.87 1.89 2.87 1.89A37.27 37.27 0 0 1 24 7.5"
      ></path>
      <path
        fill="#ff6242"
        stroke="#45413c"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.5 17a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0-9 0"
      ></path>
      <path
        fill="none"
        stroke="#45413c"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 27.82V25.5m25.13-14.11a37.49 37.49 0 0 0-33.26 0L9.63 16a18 18 0 0 1 1.87 8v4.44a2.07 2.07 0 0 0 1.66 2.08a2 2 0 0 0 2.34-2v-.68l7.61 15.36a1 1 0 0 0 1.78 0l2.61-5.27V40a1.5 1.5 0 0 0 3 0v-5.8a9.88 9.88 0 0 1 1-4.43c1.26-2.56 2.61-5.27 4-8v2.73a1.5 1.5 0 0 0 3 0V18a10.05 10.05 0 0 1 1-4.44ZM27.5 35.5v2.43m8-17.93v1.76"
      ></path>
    </svg>
  );
}

export function Export(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m-1 1.5L18.5 9H13m-4.07 3.22H16v7.07l-2.12-2.12L11.05 20l-2.83-2.83l2.83-2.82"
      ></path>
    </svg>
  );
}
