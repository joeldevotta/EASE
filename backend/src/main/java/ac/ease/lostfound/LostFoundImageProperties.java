package ac.ease.lostfound;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ease.lost-found")
public class LostFoundImageProperties {

    /**
     * Local directory for Lost & Found images. Relative paths resolve against the process working directory.
     */
    private String uploadDir = "./data/lost-found-images";

    /**
     * Maximum accepted image size in bytes. Defaults to 5 MB.
     */
    private long maxFileSizeBytes = 5_242_880L;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public long getMaxFileSizeBytes() {
        return maxFileSizeBytes;
    }

    public void setMaxFileSizeBytes(long maxFileSizeBytes) {
        this.maxFileSizeBytes = maxFileSizeBytes;
    }
}
