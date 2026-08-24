import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Camera,
  Wifi,
  FileVideo,
  Check,
} from "lucide-react";

interface AddCameraModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (camera: {
    name: string;
    source: string;
    sourceType: "upload" | "webcam" | "rtsp";
  }) => void;
}

export function AddCameraModal({ open, onClose, onAdd }: AddCameraModalProps) {
  const [tab, setTab] = useState("upload");
  const [cameraName, setCameraName] = useState("");
  const [rtspUrl, setRtspUrl] = useState("");
  const [webcamIndex, setWebcamIndex] = useState("0");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const reset = () => {
    setCameraName("");
    setRtspUrl("");
    setWebcamIndex("0");
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedFile(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) simulateUpload(file.name);
    },
    [cameraName]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
  };

  const simulateUpload = (filename: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploading(false);
        setUploadedFile(filename);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const handleSubmit = () => {
    if (!cameraName.trim()) return;

    let source = "";
    switch (tab) {
      case "upload":
        source = uploadedFile || "uploaded-video.mp4";
        break;
      case "webcam":
        source = `webcam:${webcamIndex}`;
        break;
      case "rtsp":
        source = rtspUrl;
        break;
    }

    onAdd({
      name: cameraName.trim(),
      source,
      sourceType: tab as "upload" | "webcam" | "rtsp",
    });
    handleClose();
  };

  const canSubmit =
    cameraName.trim() &&
    ((tab === "upload" && uploadedFile) ||
      (tab === "webcam") ||
      (tab === "rtsp" && rtspUrl.trim()));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="glass-panel sm:max-w-[500px] border-white/5 shadow-2xl shadow-black/40">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            Add Camera
          </DialogTitle>
          <DialogDescription>
            Configure a new surveillance camera feed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Camera Name */}
          <div className="space-y-2">
            <Label htmlFor="camera-name" className="text-xs font-medium text-foreground/70">
              Camera Name
            </Label>
            <Input
              id="camera-name"
              placeholder="e.g. Main Gate, Perimeter Alpha"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              className="glass-inset border-white/5"
            />
          </div>

          {/* Source Tabs */}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="glass-inset w-full border-white/5">
              <TabsTrigger value="upload" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <Upload className="w-3.5 h-3.5" />
                Video File
              </TabsTrigger>
              <TabsTrigger value="webcam" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <Camera className="w-3.5 h-3.5" />
                Webcam
              </TabsTrigger>
              <TabsTrigger value="rtsp" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
                <Wifi className="w-3.5 h-3.5" />
                RTSP Stream
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="mt-3">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="glass-card border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
              >
                {isUploading ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto">
                      <FileVideo className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm text-foreground/70">Uploading...</p>
                    <Progress value={uploadProgress} className="h-2 bg-white/5" />
                    <p className="text-xs text-muted-foreground/60">
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                ) : uploadedFile ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-foreground/80">
                      {uploadedFile}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      File ready. Click "Add Camera" to continue.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                    <div>
                      <p className="text-sm text-foreground/60">
                        Drag & drop a video file here
                      </p>
                      <p className="text-xs text-muted-foreground/50 mt-1">
                        MP4, AVI, MOV supported
                      </p>
                    </div>
                    <Label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/15 text-primary text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      Browse Files
                      <input
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </Label>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Webcam Tab */}
            <TabsContent value="webcam" className="mt-3">
              <div className="glass-card rounded-xl p-5 space-y-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/80">Live Webcam Input</p>
                    <p className="text-xs text-muted-foreground/60">
                      Select device index for direct capture
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-foreground/70">Device Index</Label>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <Button
                        key={i}
                        variant={webcamIndex === String(i) ? "default" : "outline"}
                        size="sm"
                        className={`flex-1 text-xs ${
                          webcamIndex === String(i) ? "" : "glass-inset border-white/5"
                        }`}
                        onClick={() => setWebcamIndex(String(i))}
                      >
                        Device {i}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* RTSP Tab */}
            <TabsContent value="rtsp" className="mt-3">
              <div className="glass-card rounded-xl p-5 space-y-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/80">Network Camera Stream</p>
                    <p className="text-xs text-muted-foreground/60">
                      Enter the RTSP/HTTP stream URL
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-foreground/70">Stream URL</Label>
                  <Input
                    placeholder="rtsp://192.168.1.100:554/stream"
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                    className="glass-inset border-white/5 font-mono text-xs"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Submit */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1 glass-inset border-white/5"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2 font-semibold"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <Camera className="w-4 h-4" />
            Add Camera
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
