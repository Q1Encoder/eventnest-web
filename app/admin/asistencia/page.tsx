"use client";

import { useState, useEffect, useMemo } from "react";
import { useZxing } from "react-zxing";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Search, Filter, CheckCircle, Clock, Download, Users, Award, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, query, where, Timestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

export default function AdminAttendancePage() {
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const { toast } = useToast();

  // === ESTADO MANUAL CERTIFICATE (SIN AFECTAR FILTROS) ===
  const [manualEvent, setManualEvent] = useState("");
  const [manualName, setManualName] = useState(""); // ← Este NO afecta la tabla

  // === ESTADO DE TABLA ===
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // ← Solo para la tabla
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { ref: videoRef } = useZxing({
    onDecodeResult: async (result) => {
      const scannedText = result.getText();
      setScannedCode(scannedText);
      await handleCheckIn(scannedText);
    },
    paused: !scannerActive,
  });

  // === CARGAR REGISTROS ===
  useEffect(() => {
    const fetchApprovedRegistrations = async () => {
      try {
        setLoading(true);
        const registrationsSnapshot = await getDocs(collection(db, "registrations"));
        const approvedRecords = await Promise.all(
          registrationsSnapshot.docs
            .filter((regDoc) => regDoc.data().confirmed === true)
            .map(async (regDoc) => {
              const regData = regDoc.data();
              const userId = regData.userId;
              const eventId = regData.eventId;

              const userDoc = await getDoc(doc(db, "users", userId));
              const userData = userDoc.exists() ? userDoc.data() : {};

              const eventDoc = await getDoc(doc(db, "events", eventId));
              const eventData = eventDoc.exists() ? eventDoc.data() : {};

              const assistanceQuery = query(
                collection(db, "assistance"),
                where("ticket", "==", regDoc.id)
              );
              const assistanceSnapshot = await getDocs(assistanceQuery);
              const checkIn = !assistanceSnapshot.empty;

              const status = checkIn ? "Checked In" : "Registered";

              return {
                id: regDoc.id,
                eventTitle: eventData.title || "Evento Desconocido",
                eventDate: eventData.time ? new Date(`2025-10-15T${eventData.time}:00`).toISOString().split("T")[0] : "N/A",
                attendeeName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Desconocido",
                attendeeEmail: userData.email || "N/A",
                ticketId: regDoc.id,
                checkIn,
                status,
                eventId,
                userId,
              };
            })
        );
        setAttendanceRecords(approvedRecords);
      } catch (error) {
        console.error("Error:", error);
        toast({ title: "Error", description: "No se pudieron cargar los registros.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRegistrations();
  }, []);

  // === FILTROS + PAGINACIÓN (useMemo para evitar re-render innecesario) ===
  const filteredAndPaginatedRecords = useMemo(() => {
    let filtered = attendanceRecords;

    // Filtro por estado
    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.attendeeName.toLowerCase().includes(lower) ||
          r.attendeeEmail.toLowerCase().includes(lower) ||
          r.ticketId.toLowerCase().includes(lower)
      );
    }

    // Paginación
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  }, [attendanceRecords, selectedStatus, searchTerm, currentPage]);

  const totalPages = Math.ceil(
    attendanceRecords.filter((r) => {
      if (selectedStatus === "all") return true;
      return r.status === selectedStatus;
    }).length / itemsPerPage
  );

  // === GENERAR CERTIFICADO MANUAL (sin afectar tabla) ===
  const generateManualCertificate = async () => {
    if (!manualEvent || !manualName.trim()) {
      toast({ title: "Faltan datos", description: "Completa evento y nombre.", variant: "destructive" });
      return;
    }

    try {
      const { generateCertificatePDF } = await import("@/lib/generateCertificatePDF");
      const { CERTIFICATE_TEMPLATES } = require("@/lib/certificateConfig");
      const templatePath = CERTIFICATE_TEMPLATES[manualEvent];

      const fileName = `Certificado - ${manualName.trim()}.pdf`;
      const pdfBlob = await generateCertificatePDF(manualName.trim(), templatePath);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Listo", description: `Generado: ${fileName}` });
      setManualName(""); // Limpia solo el input
    } catch (error) {
      toast({ title: "Error", description: "No se pudo generar el PDF.", variant: "destructive" });
    }
  };

  // === GENERAR CERTIFICADO DESDE TABLA ===
  const generateCertificate = async (record: any) => {
    if (!record.checkIn) return;
    try {
      const { generateCertificatePDF } = await import("@/lib/generateCertificatePDF");
      const { CERTIFICATE_TEMPLATES } = require("@/lib/certificateConfig");
      const templatePath = CERTIFICATE_TEMPLATES[record.eventTitle];
      if (!templatePath) {
        toast({ title: "Sin plantilla", description: `No hay PDF para "${record.eventTitle}"`, variant: "destructive" });
        return;
      }

      const fileName = `Certificado - ${record.attendeeName}.pdf`;
      const pdfBlob = await generateCertificatePDF(record.attendeeName, templatePath);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Descargado", description: fileName });
    } catch (error) {
      toast({ title: "Error", description: "Falló la generación.", variant: "destructive" });
    }
  };

  const handleCheckIn = async (id: string) => { /* ... igual que antes */ };
  const handleQRScan = () => setScannerActive(!scannerActive);

  const checkedInCount = attendanceRecords.filter((r) => r.status === "Checked In").length;
  const totalApproved = attendanceRecords.length;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">

          {/* TÍTULO */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Control de Asistencia</h1>
              <p className="text-gray-600">Check-in, certificados y reportes</p>
            </div>
            <div className="flex gap-2">
              <Button variant={scannerActive ? "destructive" : "default"} onClick={handleQRScan}>
                <QrCode className="h-4 w-4 mr-2" />
                {scannerActive ? "Detener" : "Escanear QR"}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* === GENERADOR MANUAL (SIN LAG) === */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <FileText className="h-5 w-5" />
                Certificado Manual
              </CardTitle>
              <p className="text-sm text-purple-600">Para usuarios con problemas técnicos</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Evento</label>
                  <Select value={manualEvent} onValueChange={setManualEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(require("@/lib/certificateConfig").CERTIFICATE_TEMPLATES).map((event) => (
                        <SelectItem key={event} value={event}>{event}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Nombre Completo</label>
                  <Input
                    placeholder="Ej: Ana López Martínez"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)} // ← NO afecta la tabla
                  />
                </div>
              </div>
              <Button
                className="mt-4 w-full md:w-auto"
                onClick={generateManualCertificate}
                disabled={!manualEvent || !manualName.trim()}
              >
                <Award className="h-4 w-4 mr-2" />
                Generar
              </Button>
            </CardContent>
          </Card>

          {/* === TABLA CON PAGINACIÓN === */}
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              {/* Estadísticas */}
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Aprobados</p><p className="text-2xl font-bold">{totalApproved}</p></div><Users className="h-8 w-8 text-blue-600" /></div></CardContent></Card>
                <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Check-In</p><p className="text-2xl font-bold">{checkedInCount}</p></div><CheckCircle className="h-8 w-8 text-green-600" /></div></CardContent></Card>
                <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Pendientes</p><p className="text-2xl font-bold">{totalApproved - checkedInCount}</p></div><Clock className="h-8 w-8 text-orange-600" /></div></CardContent></Card>
                <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Tasa</p><p className="text-2xl font-bold">{totalApproved ? Math.round((checkedInCount / totalApproved) * 100) : 0}%</p></div><CheckCircle className="h-8 w-8 text-purple-600" /></div></CardContent></Card>
              </div>

              {/* Filtros */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar en tabla..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reinicia página al buscar
                          }}
                        />
                      </div>
                    </div>
                    <Select value={selectedStatus} onValueChange={(v) => { setSelectedStatus(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Checked In">Check-In</SelectItem>
                        <SelectItem value="Registered">Pendientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tabla con paginación */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Registros ({filteredAndPaginatedRecords.length} de {attendanceRecords.length})</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Página {currentPage} de {totalPages || 1}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredAndPaginatedRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{record.attendeeName}</h3>
                            <Badge variant={record.checkIn ? "secondary" : "outline"} className={record.checkIn ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                              {record.checkIn ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                              {record.checkIn ? "Check-In" : "Pendiente"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-x-3">
                            <span>{record.attendeeEmail}</span>
                            <span>·</span>
                            <span>Boleto: {record.ticketId}</span>
                            <span>·</span>
                            <span>{record.eventTitle}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!record.checkIn ? (
                            <Button size="sm" onClick={() => handleCheckIn(record.ticketId)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Check-In
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Hecho
                            </Button>
                          )}
                          {record.checkIn && (
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => generateCertificate(record)}>
                              <Award className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}