import { Synode } from "@/types/synode";
import { Profile } from "@/types/profile";
import UserCard from "./UserCard";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Download, Users } from "lucide-react";
import JSZip from 'jszip';
import { generateBarcode, generateEAN13 } from "@/lib/barcodeUtils";
import QRCode from "qrcode";
import { toast } from "./ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UserListProps {
  users: Profile[];
  synodes: Synode[];
}

const USERS_PER_PAGE = 12;

const UserList = ({ users, synodes }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || 
           user.function?.toLowerCase().includes(searchLower) ||
           user.phone?.toLowerCase().includes(searchLower);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  // Group users by synode for current page
  const groupedUsers = synodes.map(synode => ({
    synode,
    users: paginatedUsers.filter(user => user.synode_id === synode.id)
  })).filter(group => group.users.length > 0);

  const downloadSelectedCodes = async (users: Profile[]) => {
    const zip = new JSZip();

    for (const user of users) {
      const userName = `${user.first_name} ${user.last_name}`;
      
      // Generate codes
      const barcodeUrl = await generateBarcode(generateEAN13(parseInt(user.id)), true);
      const qrCodeUrl = await QRCode.toDataURL(user.id, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'H'
      });

      // Create folder for each user
      const userFolder = zip.folder(userName.replace(/\s+/g, '-').toLowerCase());
      if (userFolder) {
        userFolder.file('barcode.png', barcodeUrl.split(',')[1], {base64: true});
        userFolder.file('qrcode.png', qrCodeUrl.split(',')[1], {base64: true});
      }
    }

    // Generate and download zip
    const content = await zip.generateAsync({type: "blob"});
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codes-utilisateurs.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: `Les codes de ${users.length} utilisateur(s) ont été exportés`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{users.length} utilisateurs enregistrés</span>
        </div>
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border p-4">
        {groupedUsers.map(({ synode, users: synodeUsers }) => (
          <div key={synode.id} className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-4 sticky top-0 bg-background z-10 py-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: synode.color }}
                />
                <h2 className="text-2xl font-semibold">{synode.name}</h2>
                <span className="text-sm text-muted-foreground">
                  ({synodeUsers.length} membres)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadSelectedCodes(synodeUsers)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger tous les codes
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {synodeUsers.map(user => (
                <UserCard 
                  key={user.id} 
                  user={{
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    function: user.function || '',
                    synode: synode.color,
                    phone: user.phone || '',
                  }} 
                />
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UserList;