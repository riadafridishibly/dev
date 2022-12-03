import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import {
  Accordion,
  Badge,
  Center,
  Code,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import {
  createHashRouter,
  RouterProvider,
  useNavigate,
  useParams,
} from "react-router-dom";
import data from "./generated/data.json";
import Root from "./routes/Root";

const MyCode = ({
  className,
  children,
}: {
  className: string;
  children: string;
}) => {
  if (className === undefined) {
    return <Code>{children}</Code>;
  }
  const language = className.replace("lang-", "");
  // @ts-ignore
  return <Prism language={language}>{children}</Prism>;
};

interface AccordionTitleProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  date?: string;
}

interface AccordionItemProps {
  heading: AccordionTitleProps;
  id: string;
  text: string;
}

function AccordionTitle({ title, subtitle, tags, date }: AccordionTitleProps) {
  return (
    <>
      <Group>
        <Text fw={600} fz="lg">
          # {title}
        </Text>
        <Group grow={false} spacing={5} noWrap>
          {tags?.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </Group>
      </Group>
      <Group position="apart">
        {subtitle && <Code>{subtitle}</Code>}
        {date && (
          <Text c="dimmed" fs="italic">
            {date}
          </Text>
        )}
      </Group>
    </>
  );
}

function AccordionItem({ id, heading, text }: AccordionItemProps) {
  return (
    <Accordion.Item value={id}>
      <Accordion.Control>
        <AccordionTitle {...heading} />
      </Accordion.Control>
      <Accordion.Panel>
        <Markdown
          options={{
            overrides: {
              code: {
                component: MyCode,
              },
            },
          }}
        >
          {text}
        </Markdown>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <Center>
            <Text fz="lg" fw={300} fs="italic">
              Select any item from side navbar
            </Text>
          </Center>
        ),
      },
      {
        path: "/:group",
        element: <GroupItems />,
        errorElement: <Center>Not Found</Center>,
      },
      {
        path: "/:group/:item",
        element: <GroupItems />,
        errorElement: <Center>Not Found</Center>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function GroupItems() {
  const params = useParams();
  const [activeElement, setActiveElement] = useState<string | null>();
  const [groupItems, setGroupItems] = useState<typeof data.nginx>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load groups
    if (params.group) {
      let key = params.group as keyof typeof data;
      setGroupItems(data[key]);
    }
    console.log(params);
    if (params.item) {
      // TODO: move logic to router
      // Throw error if item not found!
      setActiveElement(params.item);
    } else {
      setActiveElement(null);
    }
  }, [params.item, params.group]);

  return (
    <Accordion
      onChange={(value) => {
        setActiveElement(value);
        if (value) {
          navigate(`/${params.group}/${value}`);
        } else {
          navigate(`/${params.group}`);
        }
      }}
      value={activeElement}
      variant="separated"
    >
      {groupItems.map((item, i) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          heading={item.header}
          text={item.body}
        />
      ))}
    </Accordion>
  );
}

export default App;
