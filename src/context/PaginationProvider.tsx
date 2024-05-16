import { createContext } from "react"

type PaginationContext = object

const PaginationContext =
  createContext<PaginationContext | null>(null)
