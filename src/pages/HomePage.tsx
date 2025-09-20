import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getBooks } from "@/http/api";
import { Book } from "@/types";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4 },
  }),
};

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 10000,
  });

  return (
    <div className="p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold tracking-tight"
      >
        Dashboard
      </motion.h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Books",
            value: data?.data?.length ?? 0,
            change: "+12%",
            icon: DollarSign,
          },
          {
            title: "Authors",
            value: new Set(data?.data?.map((b: Book) => b.author?.name)).size,
            change: "+5%",
            icon: Users,
          },
          {
            title: "Genres",
            value: new Set(data?.data?.map((b: Book) => b.genre)).size,
            change: "+3%",
            icon: CreditCard,
          },
          {
            title: "Active Now",
            value: "+573",
            change: "+201",
            icon: Activity,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Books + Top Authors */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Recent Books */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Books</CardTitle>
                <CardDescription>
                  Latest books added to the store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="/dashboard/books">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Loading...</p>}
              {isError && <p className="text-red-500">Failed to load books.</p>}
              {!isLoading && !isError && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Genre
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Author
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.slice(0, 5).map((book: Book, i: number) => (
                      <motion.tr
                        key={book._id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {book.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{book.genre}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.author?.name ?? "Unknown"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Authors */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Authors</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {data?.data?.slice(0, 3).map((book: Book, i: number) => (
                <motion.div
                  key={book._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="flex items-center gap-4 hover:scale-[1.01] transition-transform"
                >
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage
                      src={book.coverImage}
                      alt={book.author?.name ?? "Unknown"}
                    />
                    <AvatarFallback>
                      {book?.author?.name?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {book?.author?.name ?? "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {book.title}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{book.genre}</div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
