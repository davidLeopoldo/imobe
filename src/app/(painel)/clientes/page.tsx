import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCPF } from "@/lib/format";
import { listarClientes } from "./_data-access/listar-clientes";

export default async function ClientesPage() {
  const clientes = await listarClientes();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <Link href="/clientes/novo" className={buttonVariants()}>
          Cadastrar cliente
        </Link>
      </div>

      <div className="mt-6">
        {clientes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.{" "}
            <Link
              href="/clientes/novo"
              className="underline underline-offset-4"
            >
              Cadastre o primeiro
            </Link>
            .
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id} className="cursor-pointer">
                  <TableCell>
                    <Link href={`/clientes/${cliente.id}`} className="block">
                      {cliente.nome}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/clientes/${cliente.id}`} className="block">
                      {formatCPF(cliente.cpf)}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
