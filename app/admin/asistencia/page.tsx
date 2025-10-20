"use client";
import { useState, useEffect } from "react";
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
import { QrCode, Search, Filter, CheckCircle, Clock, Download, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, query, where, Timestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

export default function AdminAttendancePage() {
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const { toast } = useToast();

  type AttendanceRecord = {
    id: string;
    eventTitle: string;
    eventDate: string;
    attendeeName: string;
    attendeeEmail: string;
    ticketId: string;
    checkIn: boolean;
    status: "Checked In" | "Registered";
  };

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ZXing scanner hook
  const { ref: videoRef } = useZxing({
    onDecodeResult: async (result) => {
      const scannedText = result.getText();
      setScannedCode(scannedText);
      await handleCheckIn(scannedText);
    },
    paused: !scannerActive,
  });

  // Fetch approved registrations and check-in status
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

              // Fetch user data
              const userDoc = await getDoc(doc(db, "users", userId));
              const userData = userDoc.exists() ? userDoc.data() : {};

              // Fetch event data
              const eventDoc = await getDoc(doc(db, "events", eventId));
              const eventData = eventDoc.exists() ? eventDoc.data() : {};

              // Check if check-in exists in /assistance
              const assistanceQuery = query(
                collection(db, "assistance"),
                where("ticket", "==", regDoc.id)
              );
              const assistanceSnapshot = await getDocs(assistanceQuery);
              const checkIn = !assistanceSnapshot.empty;

              const status: "Checked In" | "Registered" = checkIn ? "Checked In" : "Registered";

              return {
                id: regDoc.id,
                eventTitle: eventData.title || "Evento Desconocido",
                eventDate: eventData.time ? new Date(`2025-10-15T${eventData.time}:00`).toISOString().split("T")[0] : "N/A",
                attendeeName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Desconocido",
                attendeeEmail: userData.email || "N/A",
                ticketId: regDoc.id,
                checkIn,
                status,
              };
            })
        );
        setAttendanceRecords(approvedRecords);
        setFilteredRecords(approvedRecords);
      } catch (error) {
        console.error("Error fetching approved registrations:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los registros aprobados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRegistrations();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = attendanceRecords;

    if (selectedStatus !== "all") {
      filtered = filtered.filter((record) => {
        if (selectedStatus === "Checked In") return record.status === "Checked In";
        if (selectedStatus === "Registered") return record.status === "Registered";
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.attendeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [attendanceRecords, selectedStatus, searchTerm]);

  // Handle check-in (QR or manual)
  const handleCheckIn = async (registrationId: string) => {
    try {
      // Verify registration exists
      const registrationRef = doc(db, "registrations", registrationId);
      const registrationDoc = await getDoc(registrationRef);

      if (!registrationDoc.exists()) {
        toast({
          title: "Error",
          description: "Registro no encontrado.",
          variant: "destructive",
        });
        return;
      }

      const registrationData = registrationDoc.data();
      if (!registrationData.confirmed) {
        toast({
          title: "Error",
          description: "El registro no está aprobado.",
          variant: "destructive",
        });
        return;
      }

      // Check for existing check-in in /assistance
      const assistanceQuery = query(
        collection(db, "assistance"),
        where("ticket", "==", registrationId)
      );
      const assistanceSnapshot = await getDocs(assistanceQuery);

      if (!assistanceSnapshot.empty) {
        // Fetch user and event for error message
        const userDoc = await getDoc(doc(db, "users", registrationData.userId));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const eventDoc = await getDoc(doc(db, "events", registrationData.eventId));
        const eventData = eventDoc.exists() ? eventDoc.data() : {};

        toast({
          title: "Error",
          description: `¡${userData.firstName || "Usuario"} ${userData.lastName || ""} ya ha hecho check-in en ${eventData.title || "el evento"}!`,
          variant: "destructive",
        });
        return;
      }

      // Create new check-in record in /assistance
      const assistanceDocId = `${registrationId}_${Date.now()}`; // Unique ID for assistance document
      await setDoc(doc(db, "assistance", assistanceDocId), {
        checkIn: true,
        ticket: registrationId,
        checkInTime: Timestamp.now(), // Optional: keep timestamp for reference
      });

      // Update local state
      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.id === registrationId
            ? { ...record, checkIn: true, status: "Checked In" }
            : record
        )
      );

      // Fetch user and event for success message
      const userDoc = await getDoc(doc(db, "users", registrationData.userId));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const eventDoc = await getDoc(doc(db, "events", registrationData.eventId));
      const eventData = eventDoc.exists() ? eventDoc.data() : {};

      toast({
        title: "Check-In Exitoso",
        description: `¡${userData.firstName || "Usuario"} ${userData.lastName || ""} ha sido registrado en ${eventData.title || "el evento"}!`,
      });

      // Stop scanner after successful scan
      setScannerActive(false);
      setScannedCode("");
    } catch (error) {
      console.error("Error during check-in:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar el check-in.",
        variant: "destructive",
      });
    }
  };

  const handleQRScan = () => {
    setScannerActive(!scannerActive);
  };

  const handleManualCheckIn = (ticketId: string) => {
    handleCheckIn(ticketId);
  };

  const handleExportAttendance = () => {
    alert("Exportando reporte de asistencia...");
  };

  const checkedInCount = filteredRecords.filter((record) => record.status === "Checked In").length;
  const totalApproved = filteredRecords.length;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Control de Asistencia</h1>
              <p className="text-gray-600">Gestiona los registros aprobados y el seguimiento de asistencia</p>
            </div>
            <div className="flex gap-2">
              <Button variant={scannerActive ? "destructive" : "default"} onClick={handleQRScan}>
                <QrCode className="h-4 w-4 mr-2" />
                {scannerActive ? "Detener escáner" : "Escáner QR"}
              </Button>
              <Button variant="outline" onClick={handleExportAttendance}>
                <Download className="h-4 w-4 mr-2" />
                Exportar reporte
              </Button>
            </div>
          </div>

          {loading ? (
            <p>Cargando usuarios aprobados...</p>
          ) : (
            <>
              {scannerActive && (
                <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950">
                  <CardHeader>
                    <CardTitle className="text-blue-800 dark:text-blue-200">Escáner de Código QR Activo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <video ref={videoRef} style={{ width: "100%", maxHeight: "300px" }} />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Escanea el código QR o ingresa el ID del boleto manualmente..."
                          value={scannedCode}
                          onChange={(e) => setScannedCode(e.target.value)}
                        />
                      </div>
                      <Button onClick={() => handleCheckIn(scannedCode)}>Registrar</Button>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                      Apunta la cámara hacia un código QR o ingresa el ID del boleto manualmente
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Aprobados</p>
                        <p className="text-2xl font-bold">{totalApproved}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">(Check-In)</p>
                        <p className="text-2xl font-bold">{checkedInCount}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pendientes</p>
                        <p className="text-2xl font-bold">{totalApproved - checkedInCount}</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tasa de Asistencia</p>
                        <p className="text-2xl font-bold">
                          {totalApproved ? Math.round((checkedInCount / totalApproved) * 100) : 0}%
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros y Búsqueda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar por nombre, correo o ID de boleto..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los eventos</SelectItem>
                        {[...new Set(attendanceRecords.map((record) => record.eventTitle))].map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Checked In">Registrados (Check-In)</SelectItem>
                        <SelectItem value="Registered">Pendientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Registros Aprobados ({filteredRecords.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{record.attendeeName}</h3>
                            <Badge
                              variant={record.status === "Checked In" ? "secondary" : "outline"}
                              className={
                                record.status === "Checked In"
                                  ? "text-green-600 bg-green-50"
                                  : "text-orange-600 bg-orange-50"
                              }
                            >
                              {record.status === "Checked In" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {record.status === "Checked In" ? "Registrado" : "Pendiente"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span>{record.attendeeEmail}</span>
                            <span>Boleto: {record.ticketId}</span>
                            <span>{record.eventTitle}</span>
                            <span>{new Date(record.eventDate).toLocaleDateString()}</span>
                            {record.checkIn && (
                              <span>Registrado a las: {new Date(record.eventDate).toLocaleTimeString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {record.status === "Registered" ? (
                            <Button size="sm" onClick={() => handleManualCheckIn(record.ticketId)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Registrar
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Registrado
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