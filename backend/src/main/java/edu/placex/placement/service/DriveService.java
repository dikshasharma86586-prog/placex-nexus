package edu.placex.placement.service;

import edu.placex.placement.dto.DriveRequest;
import edu.placex.placement.exception.ApiException;
import edu.placex.placement.model.PlacementDrive;
import edu.placex.placement.repository.CompanyRepository;
import edu.placex.placement.repository.DriveRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriveService {
    private static final Set<String> STAGES = Set.of("Upcoming", "Registration Open", "Assessment", "Interview", "Results Declared");
    private final DriveRepository drives;
    private final CompanyRepository companies;

    public DriveService(DriveRepository drives, CompanyRepository companies) {
        this.drives = drives;
        this.companies = companies;
    }

    public List<PlacementDrive> findAll() { return drives.findAll(); }
    public PlacementDrive findById(String id) { return drives.findById(id).orElseThrow(() -> ApiException.notFound("Placement drive was not found.")); }

    @Transactional
    public PlacementDrive create(DriveRequest request) {
        if (drives.findById(request.id()).isPresent()) throw ApiException.conflict("A placement drive with this ID already exists.");
        validate(request);
        drives.save(request);
        return findById(request.id());
    }

    @Transactional
    public PlacementDrive update(String id, DriveRequest request) {
        findById(id);
        DriveRequest updated = new DriveRequest(id, request.companyId(), request.jobTitle(), request.description(), request.date(), request.deadline(),
                request.minCgpa(), request.branches(), request.graduationYear(), request.maxBacklogs(), request.packageLpa(), request.openings(), request.stage());
        validate(updated);
        drives.save(updated);
        return findById(id);
    }

    @Transactional
    public void delete(String id) {
        findById(id);
        if (drives.hasApplications(id)) throw ApiException.conflict("This drive has applications. Remove its applications before deleting the drive.");
        drives.delete(id);
    }

    private void validate(DriveRequest request) {
        if (companies.findById(request.companyId()).isEmpty()) throw ApiException.badRequest("The selected company does not exist.");
        if (request.deadline().isAfter(request.date())) throw ApiException.badRequest("Application deadline must be on or before the drive date.");
        if (!STAGES.contains(request.stage())) throw ApiException.badRequest("Recruitment stage is not supported.");
        if (request.date().isBefore(LocalDate.now().minusYears(1))) throw ApiException.badRequest("Drive date is outside the supported date range.");
    }
}
